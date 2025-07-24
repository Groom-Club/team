type Breed = {
  coat_type: {
    brush_frequency: string;
    groom_frequency_max: number;
    groom_frequency_min: number;
    id: number;
    name: string;
  };
  created_at: number;
  groom_frequency_max: number;
  groom_frequency_min: number;
  id: number;
  name: string;
};

type AppointmentRankConfig = {
  backtrack_max?: number;
  backtrack_penalty?: number;
  created_at?: number;
  end_zone_late_day_bonus?: number;
  end_zone_max?: number;
  first_appt_bonus?: number;
  id?: number;
  late_day_max?: number;
  lookahead_days?: number;
  start_zone_max?: number;
  status?: string;
  xl_dog_late_day_max?: number;
  xl_dog_min_weight?: number;
  xl_dog_penalty?: number;
};
type PriceModifier = {
  created_at?: number;
  id?: number;
  modifier?: number;
  position?: number;
};
