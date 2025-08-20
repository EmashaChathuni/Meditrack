import Record from '../models/Records.js';

// Create a new medical record
export const createRecord = async (req, res) => {
  try {
    const { date, diagnosis, medications, doctor, hospital, followUpDate, notes } = req.body;

    // Create a new record
    const record = new Record({
      date,
      diagnosis,
      medications,
      doctor,
      hospital,
      followUpDate,
      notes
    });

    await record.save();
    res.status(201).json({ message: 'Record created successfully', record });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create record', details: error.message });
  }
};

// Get all records
export const getRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch records', details: error.message });
  }
};

// Delete a record
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    await Record.findByIdAndDelete(id);
    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete record', details: error.message });
  }
};
