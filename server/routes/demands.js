const express = require("express");
const { JobPosting, Candidate, Demand } = require("../tables");
const router = express.Router();
const { Op } = require("sequelize");

router
  .route("/demands")
  .get(async (req, res) => {
    try {
      const { extended } = req.query;
      const demands = await Demand.findAll({
        attributes: extended
          ? undefined
          : { exclude: ["createdAt", "updatedAt"] },
      });

      return res.status(200).json(demands);
    } catch (error) {
      return res.status(500).json(error);
    }
  })
  .post(async (req, res) => {
    try {
      const { JobPostingsId, CandidateId } = req.body;
      if (!JobPostingsId || !CandidateId) {
        return res.status(400).json({ error: "Missing atributes" });
      }
      const demand = await Demand.create(req.body);
      return res.status(200).json(demand);
    } catch (error) {
      return res.status(500).json(error);
    }
  });
router
  .route("/demands/:idDemand")
  .put(async (req, res) => {
    try {
      const demand = await Demand.findByPk(req.params.idDemand);
      if (demand) {
        const { dateOfSubmission } = req.body;
        if ( !dateOfSubmission) {
          return res.status(400).json({ error: "Missing atributes" });
        }
        const updatedDemand = await demand.update(req.body);
        return res.status(200).json(updatedDemand);
      } else {
        return res.status(404).json({ error: "Demand not found" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  })
  .delete(async (req, res) => {
    try {
      const demand = await Demand.findByPk(req.params.idDemand);
      if (demand) {
        await demand.destroy();
        return res.status(200).send();
      } else {
        return res.status(404).json({ error: "Demand not found" });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  });
router.route("/jobPosting/:jobPostingId/demands").get(async (req, res) => {
  try {
    const jobPosting = await JobPosting.findByPk(req.params.jobPostingId);
    if (jobPosting) {
      const demand = await user.getDemands();
      res.status(200).json(demand);
    } else {
      res.status(404).json({ error: "JpbPosting not found" });
    }
  } catch (err) {
    return res.status(500).json(error);
  }
});
router.route("/candidates/:candidateId/demands").get(async (req, res) => {
	try {
	  const candidate = await Candidate.findByPk(req.params.candidateId);
	  if (candidate) {
		const demand = await candidate.getDemands();
		res.status(200).json(demand);
	  } else {
		res.status(404).json({ error: "Candidate not found" });
	  }
	} catch (err) {
	  return res.status(500).json(error);
	}
  });

module.exports = router;
