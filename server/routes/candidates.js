const express = require("express");
const { JobPosting, Candidate, JobPosting } = require("../tables");
const router = express.Router();
const { Op } = require("sequelize");
const bcrypt = require('bcrypt')

router
  .route("/candidates")
  .get(async (req, res) => {
	  try {
		const {extended } = req.query;
		const candidate = await Candidate.findAll({
			attributes: extended
			? undefined
			: { exclude: ["createdAt", "updatedAt"] },
		});
		return res.status(200).json(candidate);
	  } catch (error) {
		  return res.status(500).json(error);
	  }
  })
  .post(async (req, res) => {
	  try {
		  const { JobPostingId } = req.body;
		  if (!JobPostingId) {
			  return res.status(400).json({error: "Missing atributes" });
		  }
		  const candidate = await Candidate.create(req.body);
		  return res.status(200).json(candidate);
	  } catch (error) {
		  return res.status(500).json(error);
	  }
  });
  router
  .route("/candidates/:id")
  .get(async (req, res) => {
	try {
	  const candidate = await Candidate.findByPk(req.params.id);
	if (candidate) {
	  res.status(200).json(candidate);
	} else {
	  res.status(404).json({ error: "Candidate not found" });
	}
  } catch (error) {
	console.error(error);
	return res.status(500).json(error);
  }
})
  .put(async (req, res) => {
    try {
      const candidate = await Candidate.findByPk(req.params.id)
      if (candidate) {
        const { name, cv, email } = req.body
        if (!name || !cv || !email ) {
          return res.status(400).json({ error: 'Missing atributes' })
        }
        const updatedCandidate = await candidate.update(req.body)
        return res.status(200).json(updatedCandidate)
      } else {
        return res.status(404).json({ error: 'Candidate not found' })
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  })
  .delete(async (req, res) => {
    try {
      const candidate = await Candidate.findByPk(req.params.id)
      if (candidate) {
        await candidate.destroy()
        return res.status(200).send()
      } else {
        return res.status(404).json({ error: 'Candidate not found' })
      }
    } catch (error) {
      return res.status(500).json(error)
    }
  })

router
  .route('/jobposting/:jobPostingId/candidate')
  .get( async (req, res) => {
	  try {
		  const { name } = req.query;
		  const jobPosting = await JobPosting.findByPk(req.params.jobPostingId)
		  if(jobPosting) {
			  const candidate = await Candidate.findAll({
				  where: { [Op.and]: [
					  name ? {
						  name: {
							  [Op.like]: name + '%'
						  }
					  } : undefined,
					  {JobPostingId: jobPosting.id}
				  ]}
			  })
			  res.status(200).json(candidate)
		    } else {
				res.status(404).json({ error: 'User not foun'})
			}
	    } catch(err) {
			return res.status(500).json(error)
		}
    })

	.post(async (req, res) => {
		try {
		  const jobPosting = await JobPosting.findByPk(req.params.jobPostingId)
		  if (jobPosting) {
			const candidate = new Candidate(req.body)
			candidate.JobPostingId = jobPosting.id
			await candidate.save()
			res.status(201).json({ message: 'Candidate list updated' })
		  } else {
			return res.status(404).json({ error: 'JobPosting not found' })
		  }
		} catch (error) {
		  return res.status(500).json(error)
		}
	  })

module.exports = router;

