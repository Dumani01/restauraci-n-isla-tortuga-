import { getLifecycleStageRecords, getProjectRecord } from './databaseService.js';

const project = getProjectRecord();
const lifecycleIds = ['gametos', 'embrion', 'planula', 'asentamiento', 'juvenil', 'adulto'];

export const projectInfo = {
  location: project.location || '',
  locationDescription: project.locationDescription || '',
  howWeWork: Array.isArray(project.activities) ? [...project.activities] : [],
  whyRestore: project.whyRestore || '',
  collaboration: project.collaboration || '',
};

export const lifecycleStages = getLifecycleStageRecords().map((label, index) => ({
  id: lifecycleIds[index] || `stage-${index + 1}`,
  label,
}));
