export interface DogInfo {
  breed: string;
  age: string;
  gender: string;
  level: string;
  progress: number;
  sterilized: string;
  dogSource: string;
  timeWithDog: string;
  medications: string;
  currentDeworming: string;
  tickFleaPreventative: string;
  vetClinic: string;
  vetName: string;
  vetPhone: string;
  medicalIssues: string;
}

export interface DogLifestyle {
  homeAloneLocation: string;
  sleepLocation: string;
  hasCrate: string;
  likesCrate: string;
  crateLocation: string;
  chewsCrate: string;
  hoursAlone: string;
  foodBrand: string;
  feedingSchedule: string;
  foodLeftOut: string;
  allergies: string;
  toyTypes: string;
  toyPlayTime: string;
  toyStorage: string;
  walkFrequency: string;
  walkPerson: string;
  walkDuration: string;
  otherExercise: string;
  walkEquipment: string;
  offLeash: string;
  forestVisits: string;
  pulling: string;
  pullingPrevention: string;
}

export interface DogHistory {
  previousTraining: string;
  growled: string;
  growlDetails: string;
  bitten: string;
  biteDetails: string;
  fearful: string;
  fearDetails: string;
  newPeopleResponse: string;
  groomingResponse: string;
  ignoreReaction: string;
  previousServices: string;
  toolsUsed: string;
}

export interface DogGoals {
  trainingGoals: string;
  idealDogBehavior: string;
}

export interface Dog {
  id: number | string;
  name: string;
  breed: string;
  age: string;
  gender: string;
  level: string;
  progress: number;
  image: string;
  dogInfo: DogInfo;
  sterilized: string | boolean;
  dog_source?: string; // snake_case for Odoo
  lifestyle: Partial<DogLifestyle>;
  history: Partial<DogHistory>;
  goals: Partial<DogGoals>;
  behaviorChecklist: string[];
  behavior_checklist?: string[];
  behaviorDetails?: string;
  behavior_details?: string;
  undesirableBehavior?: string;
  undesirable_behavior?: string;
  fearDescription?: string;
  fear_description?: string;
  owner_id?: number | string;
  notes?: string;
  likesAboutDog?: string[];
  dislikesAboutDog?: string[];
  whyTraining?: string;
}