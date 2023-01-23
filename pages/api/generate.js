import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const food = req.body.food || '';
  if (food.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid food",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(food),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(food) {
  const capitalizedFood =
    food[0].toUpperCase() + food.slice(1).toLowerCase();
  return `Suggest a recipe that uses these ingredients

food: Chicken.

recipe: Ingredients: 4 boneless, skinless chicken breasts Salt and pepper, 
to taste 2 tablespoons olive oil 1 onion, diced
3 cloves of garlic, minced
1 cup chicken broth
1/2 cup heavy cream
1/4 cup grated Parmesan cheese
2 tablespoons chopped fresh parsley
Instructions:

Season the chicken with salt and pepper.
In a large skillet, heat the olive oil over medium-high heat.
Add the chicken and cook for about 4-5 minutes per side, or until cooked through.
Remove the chicken from the skillet and set aside.
In the same skillet, add the onion and garlic. Cook until softened, about 3-4 minutes.
Pour in the chicken broth and bring to a simmer.
Stir in the heavy cream and Parmesan cheese, and cook until the sauce has thickened, about 2-3 minutes.
Return the chicken to the skillet and spoon the sauce over the chicken.
Garnish with chopped parsley and serve with your favorite side dish.
Enjoy.)

food: Avocado

recipe:

Ingredients:

2 ripe avocados
1 teaspoon fresh lemon juice
Salt and pepper, to taste
4 slices of bread
2 cloves of garlic, minced
Olive oil
Microgreens or arugula
Red pepper flakes (optional)
Instructions:

Cut the avocados in half and remove the pit. Scoop out the avocado flesh and place it in a bowl.
Mash the avocado with a fork and add in lemon juice, salt and pepper to taste.
Toast the bread slices in a toaster or on a skillet.
While bread is still warm, rub one side of the bread with garlic cloves.
Drizzle olive oil over the bread slices.
Spread the mashed avocado on top of the bread slices.
Add microgreens or arugula on top of the avocado.
Sprinkle red pepper flakes on top if desired.
Serve immediately and enjoy!
You can also add some toppings like smoked salmon, bacon, or eggs to make it more delicious.




food: ${capitalizedFood}
recipe:`;
}
