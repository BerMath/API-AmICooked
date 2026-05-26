const {pool: db} = require('../config/database');

// Retrieve all images
const getAllPictures = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM picture');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Retrieve an image by its id
const getPictureById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('SELECT * FROM picture WHERE id = $1', [id]);
        const pictures = result.rows;

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
        const img_blob = req.file ? req.file.buffer : req.body?.img_blob;
        const alt_text = req.body?.alt_text || null;

        if (!img_blob) {
            return res.status(400).json({message: 'Blob is required'});
        }

        const result = await db.query(
            'INSERT INTO picture (img_blob, alt_text) VALUES ($1, $2) RETURNING id',
            [img_blob, alt_text || null]
        );

        res.status(201).json({message: 'Picture added successfully', id: result.rows[0].id, alt_text});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Modify an image
const updatePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const img_blob = req.file ? req.file.buffer : req.body?.img_blob;
        const alt_text = req.body?.alt_text || null;

        if (!img_blob) {
            return res.status(400).json({message: 'Blob is required'});
        }

        const result = await db.query(
            'UPDATE picture SET img_blob = $1, alt_text = $2 WHERE id = $3',
            [img_blob, alt_text || null, id]
        );

        if (result.rowCount === 0) {
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
        const result = await db.query('DELETE FROM picture WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({message: 'Picture not found'});
        }
        res.json({message: 'Picture deleted successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

// Create a profile picture for a user
const handleProfilePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({message: 'Invalid user id'});
        }

        // Read image from form-data (req.file.buffer) or JSON (req.body.img_blob)
        const img_blob = req.file ? req.file.buffer : req.body?.img_blob;

        if (!img_blob) {
            return res.status(400).json({message: 'Blob is required'});
        }

        const isProfilePictureExist = await db.query('SELECT * FROM profile_picture WHERE id_user = $1', [id]);
        let pictureResult;
        if (isProfilePictureExist.rows.length > 0) {
            const date = new Date();
            const actualTimeStamp = date.toISOString().split('T')[0] + ' '
                + date.toTimeString().split(' ')[0];
            pictureResult = await db.query('UPDATE picture SET img_blob = $1, uploaded_at = $2 WHERE id = (SELECT id_picture FROM profile_picture WHERE id_user = $3) RETURNING id', [img_blob, actualTimeStamp, id]);
        } else {
            // Create picture entry first
            pictureResult = await db.query(
                'INSERT INTO picture (img_blob, alt_text) VALUES ($1, $2) RETURNING id',
                [img_blob, `user ${id}'s profile picture`]
            );
            // Link to user
            await db.query(
                'INSERT INTO profile_picture (id_user, id_picture) VALUES ($1, $2)',
                [id, pictureResult.rows[0].id]
            );
        }

        res.status(201).json({message: 'Profile picture created successfully', id: pictureResult.rows[0].id});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// Create a picture for a recipe
const handleRecipePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({message: 'Invalid recipe id'});
        }

        const [recipe] = await db.query('SELECT id FROM Recipe WHERE id = ?', [id]);
        if (recipe.length === 0) {
            return res.status(404).json({message: 'Recipe not found'});
        }

        // Read image from form-data (req.file.buffer) or JSON (req.body.img_blob)
        const img_blob = req.file ? req.file.buffer : req.body?.img_blob;

        if (!img_blob) {
            return res.status(400).json({message: 'Blob is required'});
        }


        const isRecipePictureExist = await db.query('SELECT * FROM recipe_picture WHERE id_recipe = $1', [id]);
        let pictureResult;
        if (isRecipePictureExist.rows.length > 0) {
            const date = new Date();
            const actualTimeStamp = date.toISOString().split('T')[0] + ' '
                + date.toTimeString().split(' ')[0];
            pictureResult = await db.query('UPDATE picture SET img_blob = $1, uploaded_at = $2 WHERE id = (SELECT id_picture FROM recipe_picture WHERE id_recipe = $3) RETURNING id', [img_blob, actualTimeStamp, id]);
        } else {
            // Create picture entry first
            pictureResult = await db.query(
                'INSERT INTO picture (img_blob, alt_text) VALUES ($1, $2) RETURNING id',
                [img_blob, `recipe ${id}'s picture`]
            );
            // Link to user
            await db.query(
                'INSERT INTO recipe_picture (id_recipe, id_picture) VALUES ($1, $2)',
                [id, pictureResult.rows[0].id]
            );
        }
        res.status(201).json({message: 'Recipe picture created successfully', id: pictureResult.rows[0].id});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error.message});
    }
}

// Get a profile picture using the user's id
const getProfilePicture = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const result = await db.query('SELECT picture.img_blob FROM picture INNER JOIN profile_picture ON picture.id = profile_picture.id_picture WHERE profile_picture.id_user = $1', [id]);
        const profilePicture = result.rows;
        if (profilePicture.length === 0) {
            return res.status(404).json({message: 'Profile picture not found'});
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
        const result = await db.query('SELECT picture.img_blob FROM picture INNER JOIN recipe_picture ON picture.id = recipe_picture.id_picture WHERE recipe_picture.id_recipe = $1', [id]);
        const recipePicture = result.rows;
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
    handleRecipePicture,
    getProfilePicture,
    getRecipePicture,
    handleProfilePicture
};