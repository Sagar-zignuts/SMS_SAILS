const validator = require('validatorjs');
module.exports = {
  create: async function (req, res) {
    try {
      const { email, name, relation, studentId } = req.body;

      const validation = new validator(
        { email, name, relation, studentId },
        {
          email: 'required|email',
          name: 'required',
          relation: 'required|in:Father,Mother,Guardian,other',
          studentId: 'required',
        }
      );
      if (validation.fails()) {
        return res.status(400).json({
          status: 400,
          message: 'Field is required OR somthing entered wrong',
        });
      }

      const parent = await Parent.create({
        id: 'placeholder',
        email,
        name,
        relation,
        studentId,
      }).fetch();

      return res
        .status(200)
        .json({ status: 200, message: 'Parent created', data: parent });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: 'server Error in create student' });
    }
  },

  getById: async function (req, res) {
    try {
      const { parent_id } = req.params;

      const parent = await Parent.find({
        where : { id: parent_id }
    });

      if (!parent) {
        return res
          .status(400)
          .json({ status: 400, message: 'parent not found' });
      }

      return res
        .status(200)
        .json({ status: 200, message: 'Data fetched', data: parent });
    } catch (error) {
      console.log(error.message);
      
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },

  getAll: async function (req, res) {
    try {
      const parents = await Parent.find();

      if (parents.length === 0) {
        return res.status(400).json({
          status: 400,
          message: 'No parents found',
        });
      }

      return res.status(200).json({
        status: 200,
        message: 'parents retrieved successfully',
        data: parents,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: 'server Error in create student' });
    }
  },

  update: async function (req, res) {
    try {
      const { parent_id } = req.query;

      if (!parent_id) {
        return res
          .status(400)
          .json({ status: 400, message: 'Query parameter is required' });
      }

      const { email, name, relation } = req.body;
      const validation = new validator(
        { email, name, relation },
        {
          name: 'required',
          relation: 'required|in:Father,Mother,Guardian,other',
        }
      );

      if (validation.fails()) {
        return res.status(400).json({
          status: 400,
          message: `Error in validation : ${validation.errors.all()}`,
        });
      }

      const parent = await Parent.findOne(parent_id);
      if (!parent) {
        return res
          .status(404)
          .json({ status: 404, message: 'parent not found' });
      }

      const updates = {name, relation };

      await Parent.updateOne({ id: parent_id }).set(updates);
      const updatedParent = await Parent.find(parent_id);
      return res.json({
        status: 200,
        message: 'Parent updated',
        data: updatedParent,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },

  delete: async function (req, res) {
    try {
      const { parent_id } = req.query;
      if (!parent_id) {
        return res
          .status(400)
          .json({ status: 400, message: 'Query parameter is required' });
      }

      const parent = await Parent.findOne(parent_id);
      if (!parent) {
        return res
          .status(404)
          .json({ status: 404, message: 'parent not found' });
      }

      const deletedParent = await Parent.destroy({ id: parent_id });
      return res.json({
        status: 200,
        message: 'parent deleted',
        deletedParent,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },
};
