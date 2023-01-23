import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [foodInput, setfoodInput] = useState("");
  const [result, setResult] = useState();
  const [counter, setCounter] = useState(1);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ food: foodInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      setfoodInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  const addRow = () => {
    const newinput = document.getElementById("newinput");
    const newInputEl = document.createElement("input");
    newInputEl.type = "text";
    newInputEl.className = styles.ingredientform;
    newInputEl.name = `Ingredient-${counter}`;
    newInputEl.placeholder = "Enter an Ingredient";
    newinput.appendChild(newInputEl);
    setCounter(counter + 1);
  }

  return (
    <div>
      <div>
        <form onSubmit={onSubmit} className={styles.format}>
          <input
            className={styles.ingredientform}
            type="text"
            name="Ingredient-1"
            placeholder="Enter an Ingredient"
            value={foodInput}
            onChange={(e) => setfoodInput(e.target.value)}
          />
          <div id="newinput" className={styles.ingredientform}></div>

          <div className={styles.buttons}>
            <button
              className={styles.addbutton}
              type="button"
              onClick={addRow}
            >

              ADD
            </button>
            <br />
            <input type="submit" value="Generate Recipes" className={styles.generatebtn} />
          </div>
        </form>
      </div>
      <div className={styles.result}>{result}</div>
    </div>

  );
}
