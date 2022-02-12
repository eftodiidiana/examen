const express = require('express')
const {JobPosting, Candidate, Demand } = require('../tables')
const router = express.Router()
const { Op } = require("sequelize");

router
  .route('/jobPosting')
  .get(async (req, res) => {
    try {
      const { extended, name} = req.query;
      const jobposting = await JobPosting.findAll({
        include:  {
          model: Demand,
          attributes: ["id"],
        },
        attributes: extended ? undefined : { exclude: ['createdAt', 'updatedAt'] },
        where: name ? {

          name: {
            [Op.like]: name + '%'
          }
        } : undefined,
      });

      return res.status(200).json(jobposting)
    } catch (error) {
      return res.status(500).json(error)
    }

  })

router
  .route('/jobPosting/:id')
  .get(async (req, res) => {
      try {
        const jobPosting = await JobPosting.findByPk(req.params.id);
      if (jobPosting) {
        res.status(200).json(jobPosting);
      } else {
        res.status(404).json({ error: "JobPosting not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json(error);
    }
  })
  .post(async (req, res) => {
    try {
        const jobPosting = new JobPosting(req.body)
        await jobPosting.save()
        res.status(201).json({ message: 'JobPodtig list updated' })
    } catch (error) {
      return res.status(500).json(error)
    }
  })
  .put(async (req, res) => {
    try {
      const jobPosting = await JobPosting.findByPk(req.params.id)
      if (jobPosting) {
        const { name, description, deadline} = req.body
        if (!name || !description || !deadline ) {
          return res.status(400).json({ error: 'Missing atributes' })
        }
        const updatedJobPosting = await jobPosting.update(req.body)
        return res.status(200).json(updatedJobPosting)
      } else {
        return res.status(404).json({ error: 'JobPosting not found' })
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  })
  .delete(async (req, res) => {
    try {
      const jobPosting = await JobPosting.findByPk(req.params.id)
      if (jobPosting) {
        await jobPosting.destroy()
        return res.status(200).send()
      } else {
        return res.status(404).json({ error: 'JobPosting not found' })
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  })

router
  .route('/users/:userId/food')
  .get( async (req, res) => {
    try {
      const { name } = req.query;
      const user = await User.findByPk(req.params.userId)
      if (user) {
       const food = await Food.findAll({
        include:  {
          model: Demand,
          attributes: ["id"],
        },
        where: { [Op.and]: [
          name ? {

            name: {
              [Op.like]: name + '%'
            }
          } : undefined,
          {UserId: user.id}
        ]
        }
       })
        res.status(200).json(food)
      } else {
        res.status(404).json({ error: 'User not found' })
      }
    } catch (err) {
      return res.status(500).json(error)
    }
  })
  
  .post(async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId)
      if (user) {
        const food = new Food(req.body)
        food.UserId = user.id
        await food.save()
        res.status(201).json({ message: 'Food list updated' })
      } else {
        return res.status(404).json({ error: 'User not found' })
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  })

  module.exports = router;