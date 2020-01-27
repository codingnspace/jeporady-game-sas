import React, { useEffect, useState } from "react";
import "./styles.css";

function JepordyQuestions() {
  const [clues, setClues] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const minDate = "1996-01-01";
  const maxDate = "1996-12-31";
  const valueComparer = (a, b) => {
    return parseInt(a.value, 10) - parseInt(b.value, 10);
  };

  const handleShowingAnswer = event => {
    const clue = event.target.closest(".clue");
    clue.classList.toggle("showAnswer");
  };

  useEffect(() => {
    const retrieveClues = async () => {
      setIsLoading(true);
      try {
        await fetch(
          `https://cors-anywhere.herokuapp.com/http://jservice.io/api/clues?category=25&min_date=${minDate}&max_date=${maxDate}`
        )
          .then(res => res.json())
          .then(data => {
            const finalClues = data
              .filter(clueObj => {
                return clueObj.value;
              })
              .slice(0, 5)
              .sort(valueComparer);
            setClues(finalClues);
            setIsLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    };
    retrieveClues();
  }, []);

  const displayClues =
    clues &&
    clues.map(clue => {
      return (
        <div
          className="clue"
          key={clue.id}
          onClick={event => handleShowingAnswer(event)}
        >
          <div className="question">
            <h4>{clue.question}</h4>
            <h5>For: {clue.value}</h5>
          </div>
          <h4 className="answer">{clue.answer}</h4>
        </div>
      );
    });

  const loadingClues = (
    <div className="loading">
      <h5>Hang tight! Clues are incoming</h5>
      <picture>
        <img
          alt="Jeporady Logo"
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FeDAFMk-OpYo%2Fhqdefault.jpg&f=1&nofb=1"
        />
      </picture>
    </div>
  );

  return (
    <article>
      <h3>Science Clues</h3>
      {displayClues}
      {isLoading ? loadingClues : displayClues}
    </article>
  );
}

export default function App() {
  return (
    <main className="App">
      <h1>Let's Play Jepordy!</h1>
      <JepordyQuestions />
    </main>
  );
}

// I wasn't able to find the id for the science category through looking
// the docs. So, I wrote the following script to find the id
// const findScienceId = (id) => {
//   fetch(`https://cors-anywhere.herokuapp.com/http://jservice.io/api/categories?count=100&offset=${id}`)
// .then(res => res.json())
// .then(data => {
//   let foundScience = false;
//     const science = data.find(cat => cat.title === "science");
//     const lastId = data[data.length - 1].id;
//     if (science) {
//       foundScience = true;
//       console.log(science)
//     } else {
//       findScienceId(lastId)
//     }
// })
// .catch(err => console.error(err))
// }

// findScienceId(8960)

// science id = 25
