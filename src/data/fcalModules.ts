import { HANDBOOK_MODULES, type CourseModule } from './handbookModules.ts';

export const FCAL_MODULE_COURSES: CourseModule[] = HANDBOOK_MODULES.filter(
  m => m.faculty === 'CAL'
);
