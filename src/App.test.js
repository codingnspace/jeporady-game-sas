import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import renderer from 'react-test-renderer';
import JeopardyQuestions, {DisplayClues} from "./App";

let container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

describe("DisplayClues", () => {
  it("toggles between displaying answer and question when clicked", () => {
    const handleShowingAnswer = jest.fn();
    const clues = [{id: "1", question: "Molecule for water", answer: "H2O", value: 100}];
  
    const component = renderer.create(
      <DisplayClues 
        handleShowingAnswer={handleShowingAnswer} 
        clues={clues} />
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  
     // display answer on first click
     tree.props.onClick();
     // re-rendering
     tree = component.toJSON();
     expect(tree).toMatchSnapshot();
   
     // display the question again on second click
     tree.props.onClick();
     // re-rendering
     tree = component.toJSON();
     expect(tree).toMatchSnapshot();
  });
});

describe('JeopardyQuestions', () => {
  it('fetches data from server when server returns a successful response', async () => { // 1
    const mockSuccessResponse = [{"id":121,"answer":"6","question":"A valid clue with points","value":100,"airdate":"1996-12-10T12:00:00.000Z","category_id":25,"game_id":null,"invalid_count":null},{"id":127,"answer":"iron","question":"A clue with no points assigned","value":null,"airdate":"1984-12-10T12:00:00.000Z","category_id":25,"game_id":null,"invalid_count":null},{"id":133,"answer":"time","question":"After length, width \u0026 depth, the 4th dimension","value":300,"airdate":"1984-12-10T12:00:00.000Z","category_id":25,"game_id":null,"invalid_count":null},{"id":139,"answer":"a parasite","question":"Type of organism that lives off of another, contributing nothing","value":400,"airdate":"1984-12-10T12:00:00.000Z","category_id":25,"game_id":null,"invalid_count":null},{"id":145,"answer":"a sonic boom","question":"Shattering sound that accompanies breaking the sound barrier","value":500,"airdate":"1984-12-10T12:00:00.000Z","category_id":25,"game_id":null,"invalid_count":null},{"id":301,"answer":"an echo","question":"A sound's repetition by reflection","value":100,"airdate":"1984-11-29T12:00:00.000Z","category_id":25,"game_id":null,"invalid_count":null}];
    const mockJsonPromise = Promise.resolve(mockSuccessResponse); // 2
    const mockFetchPromise = Promise.resolve({ // 3
      json: () => mockJsonPromise,
    });
    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    await act(async () => {
      render(<JeopardyQuestions />, container);
    });
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const minDate = "1996-01-01";
    const maxDate = "1996-12-31";
    expect(global.fetch).toHaveBeenCalledWith(`https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues?category=25&min_date=${minDate}&max_date=${maxDate}`);
    expect(container.textContent).toContain("A valid clue with points");
    expect(container.textContent).not.toContain("A clue with no points assigned");
  });
});