import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PricingData {
  positionOneIncrease: string;
  positionThreeDecrease: string;
}

interface AppointmentsData {
  lookAheadDays: string;
  lateDayThreshold: string;
  startZoneThreshold: string;
  endZoneThreshold: string;
  firstAppointmentBonus: string;
  endZoneLateDayBonus: string;
  backtrackThreshold: string;
  backtrackPenaltyMultiplier: string;
  xlDogWeight: string;
  xlDogLateDayPenalty: string;
}

const PricingAppointmentsPage = () => {
  const [pricingData, setPricingData] = useState<PricingData>({
    positionOneIncrease: "",
    positionThreeDecrease: "",
  });

  const [appointmentsData, setAppointmentsData] = useState<AppointmentsData>({
    lookAheadDays: "",
    lateDayThreshold: "",
    startZoneThreshold: "",
    endZoneThreshold: "",
    firstAppointmentBonus: "",
    endZoneLateDayBonus: "",
    backtrackThreshold: "",
    backtrackPenaltyMultiplier: "",
    xlDogWeight: "",
    xlDogLateDayPenalty: "",
  });

  const handlePricingChange = (field: keyof PricingData, value: string) => {
    setPricingData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAppointmentsChange = (
    field: keyof AppointmentsData,
    value: string,
  ) => {
    setAppointmentsData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    console.log("Pricing Data:", pricingData);
    console.log("Appointments Data:", appointmentsData);
    // TODO: Implement API call to save data
  };

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
                  value={pricingData.positionOneIncrease}
                  onChange={(e) =>
                    handlePricingChange("positionOneIncrease", e.target.value)
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
                  value={pricingData.positionThreeDecrease}
                  onChange={(e) =>
                    handlePricingChange("positionThreeDecrease", e.target.value)
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lookAheadDays">Look Ahead Days</Label>
                <Input
                  id="lookAheadDays"
                  type="number"
                  placeholder="Enter number of days"
                  value={appointmentsData.lookAheadDays}
                  onChange={(e) =>
                    handleAppointmentsChange("lookAheadDays", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lateDayThreshold">Late Day Threshold (%)</Label>
                <Input
                  id="lateDayThreshold"
                  type="number"
                  step="0.01"
                  placeholder="Enter percentage"
                  value={appointmentsData.lateDayThreshold}
                  onChange={(e) =>
                    handleAppointmentsChange("lateDayThreshold", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startZoneThreshold">
                  Start Zone Threshold (minutes)
                </Label>
                <Input
                  id="startZoneThreshold"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.startZoneThreshold}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "startZoneThreshold",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endZoneThreshold">
                  End Zone Threshold (minutes)
                </Label>
                <Input
                  id="endZoneThreshold"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.endZoneThreshold}
                  onChange={(e) =>
                    handleAppointmentsChange("endZoneThreshold", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstAppointmentBonus">
                  First Appointment Bonus (minutes)
                </Label>
                <Input
                  id="firstAppointmentBonus"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.firstAppointmentBonus}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "firstAppointmentBonus",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endZoneLateDayBonus">
                  End Zone Late Day Bonus (minutes)
                </Label>
                <Input
                  id="endZoneLateDayBonus"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.endZoneLateDayBonus}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "endZoneLateDayBonus",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backtrackThreshold">
                  Backtrack Threshold (minutes)
                </Label>
                <Input
                  id="backtrackThreshold"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.backtrackThreshold}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "backtrackThreshold",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="backtrackPenaltyMultiplier">
                  Backtrack Penalty Multiplier
                </Label>
                <Input
                  id="backtrackPenaltyMultiplier"
                  type="number"
                  step="0.01"
                  placeholder="Enter decimal value"
                  value={appointmentsData.backtrackPenaltyMultiplier}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "backtrackPenaltyMultiplier",
                      e.target.value,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xlDogWeight">XL Dog Weight (pounds)</Label>
                <Input
                  id="xlDogWeight"
                  type="number"
                  placeholder="Enter weight in pounds"
                  value={appointmentsData.xlDogWeight}
                  onChange={(e) =>
                    handleAppointmentsChange("xlDogWeight", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="xlDogLateDayPenalty">
                  XL Dog Late Day Penalty (minutes)
                </Label>
                <Input
                  id="xlDogLateDayPenalty"
                  type="number"
                  placeholder="Enter minutes"
                  value={appointmentsData.xlDogLateDayPenalty}
                  onChange={(e) =>
                    handleAppointmentsChange(
                      "xlDogLateDayPenalty",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="px-6">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingAppointmentsPage;
