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
  biteInjury: string;
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

export interface DogInfo {
  breed: string;
  age: string;
  gender: string;
  level: string;
  progress: number;
  sterilized: string | boolean;
  dogSource: string;
  dog_source?: string; // snake_case for Odoo
  timeWithDog: string;
  time_with_dog?: string;
  medications: string;
  currentDeworming: string;
  current_deworming?: string;
  tickFleaPreventative: string;
  tick_flea_preventative?: string;
  vetClinic: string;
  vet_clinic?: string;
  vetName: string;
  vet_name?: string;
  vetPhone: string;
  vet_phone?: string;
  vetAddress: string;
  vet_address?: string;
  medicalIssues: string;
  medical_issues?: string;

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