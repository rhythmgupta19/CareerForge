import Domain from '../models/Domain.js';
import Phase from '../models/Phase.js';
import Topic from '../models/Topic.js';

export const getDomains = async (req, res) => {
  try {
    const domains = await Domain.find({});
    res.json(domains);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDomainById = async (req, res) => {
  try {
    const domain = await Domain.findById(req.params.id).populate({
      path: 'phases',
      populate: { path: 'topics' }
    });
    if (domain) {
      res.json(domain);
    } else {
      res.status(404).json({ message: 'Domain not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createDomain = async (req, res) => {
  try {
    const domain = new Domain(req.body);
    const createdDomain = await domain.save();
    res.status(201).json(createdDomain);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
