const { validator, redisClient, DEFAULT_TTL , v4} = sails.config.constant;


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
        id : v4(),
        email,
        name,
        relation,
        studentId,
      }).fetch();

      await redisClient.setEx(
        `parent:${parent.id}`,
        DEFAULT_TTL,
        JSON.stringify(parent)
      );

      return res
        .status(200)
        .json({ status: 200, message: 'Parent created', data: parent });
    } catch (error) {
      console.log(error.message);
      
      return res
        .status(500)
        .json({ status: 500, message: 'server Error in create parent' });
    }
  },

  getById: async function (req, res) {
    try {
      const parentId = req.params.id;

      const redisKey = `parent:${parentId}`;
      const cachedParent = await redisClient.get(redisKey);

      if (cachedParent) {
        return res.status(200).json({
          status: 200,
          message: 'data fetched',
          data: JSON.parse(cachedParent),
        }); // Return cached data
      }

      const parent = await Parent.findOne({ id: parentId });

      if (!parent) {
        return res
          .status(400)
          .json({ status: 400, message: 'parent not found' });
      }

      await redisClient.setEx(redisKey, DEFAULT_TTL , JSON.stringify(parent));
      return res
        .status(200)
        .json({ status: 200, message: 'Data fetched', data: parent });
    } catch (error) {
      return res
        .status(500)
        .json({ status: 500, message: error.message || 'Server error' });
    }
  },

  getAll: async function (req, res) {
    try {
      const { email } = req.query;
      const criteria = {};

      if (email) {
        criteria.email = { contains: email };
      }

      const parents = await Parent.find(criteria);

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
      const { parentId } = req.query;

      if (!parentId) {
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

      const parent = await Parent.findOne(parentId);
      if (!parent) {
        return res
          .status(404)
          .json({ status: 404, message: 'parent not found' });
      }

      const updates = { name, relation };

      await Parent.updateOne({ id: parentId }).set(updates);
      const updatedParent = await Parent.findOne({ id: parentId });

      await redisClient.setEx(`parent:${parentId}`, DEFAULT_TTL, JSON.stringify(updatedParent));

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
      const { parentId } = req.query;
      if (!parentId) {
        return res
          .status(400)
          .json({ status: 400, message: 'Query parameter is required' });
      }

      const parent = await Parent.findOne({ id: parentId });
      if (!parent) {
        return res
          .status(400)
          .json({ status: 400, message: 'parent not found' });
      }

      const deletedParent = await Parent.destroy({ id: parentId });

      await redisClient.del(`parent:${parentId}`);

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
