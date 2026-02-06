const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
    try {
        const projects = await Project.find()
            .populate('client', 'companyName email')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('client', 'companyName email contactPerson phone website');

        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        res.json(project);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Project not found' });
        }
        res.status(500).send('Server Error');
    }
};

exports.createProject = async (req, res) => {
    try {
        const {
            name,
            client,
            description,
            github,
            env,
            deploymentUrls,
            status,
            techStack,
            notes
        } = req.body;

        const newProject = new Project({
            name,
            client,
            description,
            github,
            env,
            deploymentUrls,
            status,
            techStack,
            notes
        });

        const project = await newProject.save();
        const populatedProject = await Project.findById(project._id)
            .populate('client', 'companyName email');

        res.json(populatedProject);
    } catch (err) {
        console.error("Create Project Error:", err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const {
            name,
            client,
            description,
            github,
            env,
            deploymentUrls,
            status,
            techStack,
            notes
        } = req.body;

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (client !== undefined) updateFields.client = client;
        if (description !== undefined) updateFields.description = description;
        if (github !== undefined) updateFields.github = github;
        if (env !== undefined) updateFields.env = env;
        if (deploymentUrls !== undefined) updateFields.deploymentUrls = deploymentUrls;
        if (status !== undefined) updateFields.status = status;
        if (techStack !== undefined) updateFields.techStack = techStack;
        if (notes !== undefined) updateFields.notes = notes;

        const updated = await Project.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields },
            { new: true }
        ).populate('client', 'companyName email');

        res.json(updated);
    } catch (err) {
        console.error("Update Project Error:", err.message);
        res.status(500).json({ msg: err.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ msg: 'Project not found' });
        }

        await Project.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Project deleted' });
    } catch (err) {
        console.error("Delete Project Error:", err.message);
        res.status(500).json({ msg: err.message });
    }
};
