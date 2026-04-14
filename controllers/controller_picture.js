const {promisePool: db} = require('../config/database');

// Retrieve all images
const getAllPictures = async (req, res) => {
    try {
        const [pictures] = await db.query('SELECT * FROM Picture');
        res.json(pictures);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Retrieve an image by its id
const getPictureById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [pictures] = await db.query('SELECT * FROM Picture WHERE id = ?', [id]);

        if (pictures.length === 0) {
            return res.status(404).json({message: 'Picture not found'});
        }
        res.json(pictures[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Add an image
const addPicture = async (req, res) => {
    try {
        const {blob, alt_text} = req.body;

        if (!blob) {
            return res.status(400).json({message: 'Blob is required'});
        }

        const [result] = await db.query(
            'INSERT INTO Picture (blob, alt_text) VALUES (?, ?)',
            [blob, alt_text || null]
        );

        res.status(201).json({message: 'Picture added successfully', id: result.insertId, blob, alt_text});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Modify an image
const updatePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {blob, alt_text} = req.body;

        if (!blob) {
            return res.status(400).json({message: 'Blob is required'});
        }

        const [result] = await db.query(
            'UPDATE Picture SET blob = ?, alt_text = ? WHERE id = ?',
            [blob, alt_text || null, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Picture not found'});
        }
        res.json({message: 'Picture updated successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Delete an image
const deletePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [result] = await db.query('DELETE FROM Picture WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({message: 'Picture not found'});
        }
        res.json({message: 'Picture deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Create a profile picture for a user
const createProfilePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {blob} = req.body;
        await fetch(`http://localhost:${process.env.PORT}/pictures`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({img_blob: blob, alt_text: `user ${id}'s profile picture`})
        })
            .then(response => response.json())
            .then(data => {
                const pictureId = data.id;
                return db.query('INSERT INTO ProfilePicture (id_user, id_picture) VALUES (?, ?)', [id, pictureId]);
            })
            .then(() => res.status(201).json({message: 'Profile picture created successfully'}))
            .catch(error => {
                console.error(error);
                res.status(500).json({message: 'Server error', error: error.message});
            });
    } catch
        (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// Create a picture for a recipe
const createRecipePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {blob} = req.body;
        await fetch(`http://localhost:${process.env.PORT}/pictures`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({img_blob: blob, alt_text: `user ${id}'s profile picture`})
        })
            .then(response => response.json())
            .then(data => {
                const pictureId = data.id;
                return db.query('INSERT INTO RecipePicture (id_user, id_picture) VALUES (?, ?)', [id, pictureId]);
            })
            .then(() => res.status(201).json({message: 'Profile picture created successfully'}))
            .catch(error => {
                console.error(error);
                res.status(500).json({message: 'Server error', error: error.message});
            });
    } catch
        (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// Get a profile picture using the user's id
const getProfilePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [profilePicture] = await db.query('SELECT Picture.img_blob FROM Picture INNER JOIN ProfilePicture ON Picture.id = ProfilePicture.id_picture WHERE ProfilePicture.id_user = ?', [id]);
        if (profilePicture.length === 0) {
            return res.status(404).json({message: 'ProfilePicture not found'});
        }
        res.json({picture: profilePicture});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// Get a recipe picture using the user's id
const getRecipePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const [recipePicture] = await db.query('SELECT Picture.img_blob FROM Picture INNER JOIN RecipePicture ON Picture.id = RecipePicture.id_picture WHERE RecipePicture.id_recipe = ?', [id]);
        if (recipePicture.length === 0) {
            return res.status(404).json({message: 'Recipe picture not found'});
        }
        res.json({picture: recipePicture});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

module.exports = {
    getAllPictures,
    getPictureById,
    addPicture,
    updatePicture,
    deletePicture,
    createRecipePicture,
    getProfilePicture,
    getRecipePicture,
    createProfilePicture
};

