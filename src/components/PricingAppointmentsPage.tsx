import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import useApi from "@/api";
import { Switch } from "./ui/switch";

interface PricingData {
  positionOneIncrease: string;
  positionThreeDecrease: string;
}

const initialAppointmentsData = {
  lookahead_days: 0,
  late_day_max: 0,
  start_zone_max: 0,
  end_zone_max: 0,
  first_appt_bonus: 0,
  end_zone_late_day_bonus: 0,
  backtrack_max: 0,
  backtrack_penalty: 0,
  xl_dog_min_weight: 0,
  xl_dog_penalty: 0,
  status: "INACTIVE",
};
const PricingAppointmentsPage = () => {
  const [pricingData, setPricingData] = useState<PriceModifier[]>([]);
  const [loading, setLoading] = useState(false);

  const [appointmentsData, setAppointmentsData] =
    useState<AppointmentRankConfig>(initialAppointmentsData);
  const api = useApi();

  const fetchData = async () => {
    const appointmentRes = await api.config.getAppointmentRankConfig();
    const priceRes = await api.config.getPrices();
    setAppointmentsData(appointmentRes.data?.[0] || initialAppointmentsData);
    setPricingData(priceRes.data || []);
  };
  useEffect(() => {
    setLoading(true);
    fetchData();
    setLoading(false);
  }, []);

  const handlePricingChange = (id: number, modifier: number) => {
    setPricingData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, modifier } : item))
    );
  };

  const handleAppointmentsChange = (
    field: keyof AppointmentRankConfig,
    value: string
  ) => {
    setAppointmentsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    const PricingChangeRes = await Promise.all(
      pricingData.map(async (item) => {
        if (item.id) {
          return (await api.config.updatePriceModifier(item.id, { ...item }))
            ?.data;
        } else {
          throw new Error("Price modifier ID is required");
        }
      })
    );
    const AppointmentChangeRes = await api.config.updateAppointmentRankConfig(
      appointmentsData.id,
      appointmentsData
    );
    setLoading(false);
  };

  const firstPositionPriceObj = pricingData.find((item) => item.position === 0);
  const thirdPositionPriceObj = pricingData.find((item) => item.position === 2);

  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-6">
          Pricing & Appointments
        </h1>

        {/* Pricing Section */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="positionOneIncrease">
                  Position One (% increase)
                </Label>
                <Input
                  id="positionOneIncrease"
                  type="number"
                  step="0.01"
                  placeholder="Enter percentage"
                  value={firstPositionPriceObj?.modifier}
                  onChange={(e) =>
                    handlePricingChange(
                      firstPositionPriceObj?.id,
                      +e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="positionThreeDecrease">
                  Position Three (% decrease)
                </Label>
                <Input
                  id="positionThreeDecrease"
                  type="number"
                  step="0.01"
                  placeholder="Enter percentage"
                  value={thirdPositionPriceObj?.modifier}
                  onChange={(e) =>
                    handlePricingChange(
                      thirdPositionPriceObj?.id,
                      +e.target.value
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Appointments</CardTitle>
              <Switch
                checked={appointmentsData.status === "ACTIVE"}
                onCheckedChange={(val) =>
                  handleAppointmentsChange(
                    "status",
                    val ? "ACTIVE" : "INACTIVE"
                  )
                }
                className="data-[state=checked]:bg-green-500"
                disabled={loading}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lookahead_days">Look Ahead Days</Label>
                <Input
                  id="lookahead_days"
                  type="number"
                  placeholder="Enter number of days"
                  value={appointmentsData.lookahead_days}
                  onChange={(e) =>
                    handleAppointmentsChange("lookahead_days", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="late_day_max">Late Day Threshold (%)</Label>
                <Input
                  id="late_day_max"
                  type="number"
                  step="0.01"
                  placeholder="Enter percentage"
                  value={appointmentsData.late_day_max}
                  onChange={(e) =>
                    handleAppointmentsChange("late_day_max", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start_zone_max">
                  Start Zone Threshold (minutes)
                </Label>
                <Input
                  id="start_zone_max"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.start_zone_max}
                  onChange={(e) =>
                    handleAppointmentsChange("start_zone_max", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_zone_max">
                  End Zone Threshold (minutes)
                </Label>
                <Input
                  id="end_zone_max"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.end_zone_max}
                  onChange={(e) =>
                    handleAppointmentsChange("end_zone_max", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="first_appt_bonus">
                  First Appointment Bonus (minutes)
                </Label>
                <Input
                  id="first_appt_bonus"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.first_appt_bonus}
                  onChange={(e) =>
                    handleAppointmentsChange("first_appt_bonus", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_zone_late_day_bonus">
                  End Zone Late Day Bonus (minutes)
                </Label>
                <Input
                  id="end_zone_late_day_bonus"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.end_zone_late_day_bonus}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "end_zone_late_day_bonus",
                      e.target.value
                    )
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backtrack_max">
                  Backtrack Threshold (minutes)
                </Label>
                <Input
                  id="backtrack_max"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.backtrack_max}
                  onChange={(e) =>
                    handleAppointmentsChange("backtrack_max", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backtrack_penalty">
                  Backtrack Penalty Multiplier
                </Label>
                <Input
                  id="backtrack_penalty"
                  type="number"
                  step="0.01"
                  placeholder="Enter decimal value"
                  value={appointmentsData.backtrack_penalty}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "backtrack_penalty",
                      e.target.value
                    )
                  }
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xl_dog_min_weight">
                  XL Dog Weight (pounds)
                </Label>
                <Input
                  id="xl_dog_min_weight"
                  type="number"
                  placeholder="Enter weight in pounds"
                  value={appointmentsData.xl_dog_min_weight}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "xl_dog_min_weight",
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xl_dog_penalty">
                  XL Dog Late Day Penalty (minutes)
                </Label>
                <Input
                  id="xl_dog_penalty"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.xl_dog_penalty}
                  onChange={(e) =>
                    handleAppointmentsChange("xl_dog_penalty", e.target.value)
                  }
                  disabled={loading}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-6" disabled={loading}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingAppointmentsPage;
