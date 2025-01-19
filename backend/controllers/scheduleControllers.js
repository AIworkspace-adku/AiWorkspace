const Schedule = require('../models/Schedule');
const Team = require('../models/Teams');
const Projects = require('../models/Projects');

const addMeeting = async (req, res) => {
	const { projId, date, time, moto } = req.body;

	try {
		const project = await Projects.findById(projId);
		if (!project) return res.status(400).json({ message: "Project was not found" });

		const teamId = project.owner.teamId;

		const newMeeting = new Schedule({
			moto: moto,
			teamId: teamId,
			projId: projId,
			date: date,
			time: time,
		})

		const savedMeeting = await newMeeting.save();

		return res.status(200).json({ message: "Meeting scheduled successfully", savedMeeting: savedMeeting });
	}

	catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error creating meeting" });
	}
};

const updateMeeting = async (req, res) => {
	const { meetingId, date, time, moto, reminder, reminderUpdate } = req.body;

	try {
		let updatedMeet = null;
		if (!reminderUpdate) {
			updatedMeet = await Schedule.findByIdAndUpdate(meetingId, {
				moto: moto,
				date: date,
				time: time,
			},
				{ new: true }
			);
		}
		else {
			updatedMeet = await Schedule.findByIdAndUpdate(meetingId, {
				reminder: reminder
			},
				{ new: true }
			);
		}
		if (!updatedMeet) return res.status(400).json({ message: "Meeting was not found" });

		return res.status(200).json({ message: "Meeting updated successfully", updatedMeet: updatedMeet });
	}

	catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error updating meeting" });
	}
};

const deleteMeeting = async (req, res) => {
	const { meetingId } = req.body;

	try {
		const deletedMeet = await Schedule.findOneAndDelete({ _id: meetingId });
		if (!deletedMeet) return res.status(404).json({ message: "Meet not found" });

		return res.status(200).json({ message: "Meet deleted" });
	}
	catch (error) {
		console.log(error);
		return res.status(500).json({ message: "Error deleting meet" });
	}
};

const fetchMeets = async (req, res) => {
	const { projId } = req.body;

	try {
		const schedules = await Schedule.find({ projId: projId });

		return res.status(200).json({ message: "Meetings retrieved successfully", schedules: schedules });
	}
	catch (error) {
		console.log(error);
	}
};

const fetchTodaySchedule = async (req, res) => {
	const { email } = req.body;

	try {
		const userTeams = await Team.find({
			$or: [
				{ 'owner.email': email }, // User is the owner of the team
				{ 'members': { $elemMatch: { email: email } } } // User is a member of the team
			]
		}).select('_id'); // Select only the team IDs

		if (userTeams.length === 0) {
			return res.status(404).json({ message: 'User is not part of any team' });
		}

		// Extract team IDs
		const teamIds = userTeams.map(team => team._id);

		const today = new Date().toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'

		// Find meetings scheduled for today
		const todayMeetings = await Schedule.find({
			teamId: { $in: teamIds }, // Filter by team IDs
			date: today // Match today's date in string format
		});

		if (todayMeetings.length === 0) {
			return res.status(404).json({ message: 'No meetings scheduled for today' });
		}

		return res.status(200).json({ schedule: todayMeetings });
	}
	catch (error) {
		return res.status(500).json({ message: "Error fetching todays schedule" });
	}
};

module.exports = {
    addMeeting,
    updateMeeting,
    deleteMeeting,
    fetchMeets,
    fetchTodaySchedule
}