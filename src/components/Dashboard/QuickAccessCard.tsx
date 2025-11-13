import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickAccessCardProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  progress?: number;
  progressLabel?: string;
  buttonText: string;
  buttonAction: string;
  accentColor: string;
  badge?: string;
  stats?: { label: string; value: string }[];
}

const QuickAccessCard = ({
  icon: Icon,
  title,
  subtitle,
  progress,
  progressLabel,
  buttonText,
  buttonAction,
  accentColor,
  badge,
  stats
}: QuickAccessCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(buttonAction);
  };

  return (
    <Card 
      className={`group hover:scale-105 transition-all duration-300 cursor-pointer bg-card/95 backdrop-blur border-2 hover:shadow-glow`}
      style={{ borderColor: accentColor }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div 
            className="h-12 w-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${accentColor}20` }}
          >
            <Icon className="h-6 w-6" style={{ color: accentColor }} />
          </div>
          {badge && (
            <Badge className="text-xs" style={{ backgroundColor: `${accentColor}20`, color: accentColor, borderColor: `${accentColor}50` }}>
              {badge}
            </Badge>
          )}
        </div>

        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{subtitle}</p>

        {progress !== undefined && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">{progressLabel}</span>
              <span className="font-bold" style={{ color: accentColor }}>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {stats && (
          <div className="space-y-2 mb-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="font-medium">{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        <Button 
          onClick={handleClick}
          className="w-full neon-pulse"
          style={{ 
            background: `linear-gradient(135deg, ${accentColor}E6, ${accentColor}CC)`,
            boxShadow: `0 0 20px ${accentColor}40`
          }}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAccessCard;
