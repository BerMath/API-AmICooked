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
        const img_blob = req.file ? req.file.buffer : req.body?.img_blob;
        const alt_text = req.body?.alt_text || null;

        if (!img_blob) {
            return res.status(400).json({message: 'Blob is required'});
        }

        const [result] = await db.query(
            'INSERT INTO Picture (img_blob, alt_text) VALUES (?, ?)',
            [img_blob, alt_text || null]
        );

        res.status(201).json({message: 'Picture added successfully', id: result.insertId, alt_text});
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

        const [result] = await db.query(
            'UPDATE Picture SET img_blob = ?, alt_text = ? WHERE id = ?',
            [img_blob, alt_text || null, id]
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

        const [isProfilePictureExist] = await db.query('SELECT * FROM ProfilePicture WHERE id_user = ?', [id]);
        let pictureResult;
        if (isProfilePictureExist.length > 0) {
            const date = new Date();
            const actualTimeStamp = date.toISOString().split('T')[0] + ' '
                + date.toTimeString().split(' ')[0];
            [pictureResult] = await db.query('UPDATE Picture INNER JOIN ProfilePicture ON Picture.id = ProfilePicture.id_picture SET Picture.img_blob = ?, Picture.uploaded_at = ? WHERE ProfilePicture.id_user = ?', [img_blob, actualTimeStamp, id]);
        } else {
            // Create picture entry first
            [pictureResult] = await db.query(
                'INSERT INTO Picture (img_blob, alt_text) VALUES (?, ?)',
                [img_blob, `user ${id}'s profile picture`]
            );
            // Link to user
            await db.query(
                'INSERT INTO ProfilePicture (id_user, id_picture) VALUES (?, ?)',
                [id, pictureResult.insertId]
            );
        }

        res.status(201).json({message: 'Profile picture created successfully', id: pictureResult.insertId});
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

        // Read image from form-data (req.file.buffer) or JSON (req.body.img_blob)
        const img_blob = req.file ? req.file.buffer : req.body?.img_blob;

        if (!img_blob) {
            return res.status(400).json({message: 'Blob is required'});
        }


        const [isRecipePictureExist] = await db.query('SELECT * FROM RecipePicture WHERE id_recipe = ?', [id]);
        let pictureResult;
        if (isRecipePictureExist.length > 0) {
            const date = new Date();
            const actualTimeStamp = date.toISOString().split('T')[0] + ' '
                + date.toTimeString().split(' ')[0];
            [pictureResult] = await db.query('UPDATE Picture INNER JOIN RecipePicture ON Picture.id = RecipePicture.id_picture SET Picture.img_blob = ?, Picture.uploaded_at = ? WHERE RecipePicture.id_recipe = ?', [img_blob, actualTimeStamp, id]);
        } else {
            // Create picture entry first
            [pictureResult] = await db.query(
                'INSERT INTO Picture (img_blob, alt_text) VALUES (?, ?)',
                [img_blob, `recipe ${id}'s picture`]
            );
            // Link to user
            await db.query(
                'INSERT INTO RecipePicture (id_recipe, id_picture) VALUES (?, ?)',
                [id, pictureResult.insertId]
            );
        }
        res.status(201).json({message: 'Recipe picture created successfully', id: pictureResult.insertId});
    } catch (error) {
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
    handleRecipePicture,
    getProfilePicture,
    getRecipePicture,
    handleProfilePicture
};

