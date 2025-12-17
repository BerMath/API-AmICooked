// Données en mémoire (remplace par une DB plus tard)
let recipes = [
  { id: 1, title: 'Spaghetti Bolognese', ingredients: ['spaghetti', 'tomato sauce', 'ground beef'], instructions: 'Cook spaghetti. Prepare sauce with ground beef. Mix together.' },
  { id: 2, title: 'Chicken Curry', ingredients: ['chicken', 'curry powder', 'coconut milk'], instructions: 'Cook chicken. Add curry powder and coconut milk. Simmer until done.' }
];

// Récupérer toutes les recettes
const getRecipes = (req, res) => {
  res.json(recipes);
};

// Récupérer une recette par id
const getRecipeById = (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return res.status(404).json({ message: 'Recette non trouvée' });
    res.json(recipe);
};

// Créer une recette
const createRecipe = (req, res) => {
    const { title, ingredients, instructions } = req.body;
    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const newRecipe = { id: recipes.length + 1, title, ingredients, instructions };
    recipes.push(newRecipe);
    res.status(201).json(newRecipe);
};

// Ajouter du temps de préparation à une recette
const timeRecipe = (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return res.status(404).json({ message: 'Recette non trouvée' });

    const { time } = req.body;
    if (!time) return res.status(400).json({ message: 'Le temps est requis' });

    recipe.time = time;
    res.json(recipe);
};

// Modifier une recette
const updateRecipe = (req, res) => {
    const id = parseInt(req.params.id);
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return res.status(404).json({ message: 'Recette non trouvée' });

    const { title, ingredients, instructions } = req.body;
    if (!title || !ingredients || !instructions) {
        return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    recipe.title = title;
    recipe.ingredients = ingredients;
    recipe.instructions = instructions;
    res.json(recipe);
};

// Supprimer une recette
const deleteRecipe = (req, res) => {
    const id = parseInt(req.params.id);
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return res.status(404).json({ message: 'Recette non trouvée' });

    recipes.splice(index, 1);
    res.status(204).send(); // 204 = No Content
};

module.exports = { getRecipes, getRecipeById, createRecipe, timeRecipe, updateRecipe, deleteRecipe };