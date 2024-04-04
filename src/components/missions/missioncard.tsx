interface Mission {
    id: number;
    title: string;
    description: string;
    missionToComplete: number;
    missionCompleted: number;
  }
  
  interface MissionCardProps {
    missions: Mission[];
  }
  
  const MissionCard: React.FC<MissionCardProps> = ({ missions }) => {
    return (
      <div className="bg-gray-800 rounded-lg flex flex-col">
        <ul className="flex flex-col gap-5">
          {missions.map((mission) => (
            <li key={mission.id} className="p-2 flex flex-col bg-gray-900 rounded-lg gap-3">
              <div className="flex justify-between">
                <h3 className="text-white">{mission.title}</h3>
                <p className="text-white">{mission.missionCompleted}/{mission.missionToComplete}</p>
              </div>
              <div className="text-center">
                <p>{mission.description}</p>
              </div>
              <div className="flex h-2 bg-gray-600 rounded">
                <div
                  className="bg-blue-500 h-full rounded"
                  style={{
                    width: `${(mission.missionCompleted / mission.missionToComplete) * 100}%`,
                  }}
                ></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default MissionCard;
  