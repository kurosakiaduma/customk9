"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import ServiceFactory from "@/services/ServiceFactory";
import { format } from "date-fns";
import { TrainingPlan, SubTask } from "@/services/odoo/odoo.types";



// Extend the TrainingPlan type to include our parsed tasks
interface ProcessedTrainingPlan extends TrainingPlan {
  tasks: SubTask[];
}


const calculateProgress = (tasks: SubTask[]) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter((task) => task.stage_id && task.stage_id[0] === 4).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

const TrainingPlanCard = ({ plan, isSelected, onClick }: { plan: ProcessedTrainingPlan; isSelected: boolean; onClick: () => void }) => {
  const tasks = plan.tasks || [];
  const progress = calculateProgress(tasks);

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 mb-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'border-2 border-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-black">{plan.name}</h3>
        <span className="text-sm text-black">
          {plan.create_date ? format(new Date(plan.create_date), 'MMM d, yyyy') : 'N/A'} - {plan.date_deadline ? format(new Date(plan.date_deadline), 'MMM d, yyyy') : 'Ongoing'}
        </span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-black">Progress</span>
          <span className="text-sm font-medium text-black">{progress}%</span>
        </div>
        <p className="text-sm text-black">{progress}% complete</p>
      </div>
      <div className="mt-2">
        <span className="text-sm text-black">{tasks.length} Tasks</span>
      </div>
    </div>
  );
};



// Component for the detailed view of a training plan
const TrainingPlanDetail = ({ plan }: { plan: ProcessedTrainingPlan }) => {
    const tasks = plan.tasks || [];
  const progress = calculateProgress(tasks);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-2 text-black">{plan.name}</h2>
        <div className="flex justify-between items-center">
          <span className="text-black">
            {plan.create_date ? format(new Date(plan.create_date), 'MMM d, yyyy') : 'N/A'} - {plan.date_deadline ? format(new Date(plan.date_deadline), 'MMM d, yyyy') : 'Ongoing'}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {progress}% Complete
          </span>
        </div>
      </div>
      
      {plan.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2 text-black">Description</h3>
          <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: plan.description || '' }} />
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4 text-black">Tasks & Skills</h3>
        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border">
              <h4 className="font-semibold text-black">{task.name}</h4>
              <p className="text-sm text-black mt-1">{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// TrainingContent is a client component that uses useSearchParams
const TrainingContent = () => {
  const [plans, setPlans] = useState<TrainingPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ProcessedTrainingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  const odooClientService = ServiceFactory.getInstance().getOdooClientService();
  const authService = ServiceFactory.getInstance().getAuthService();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!authService.isAuthenticated()) {
          setError("You must be logged in to view training plans.");
          setLoading(false);
          return;
        }

        const currentUser = await authService.getCurrentUser();

        if (currentUser && currentUser.partnerId) {
          const trainingPlans = await odooClientService.getTrainingPlans(currentUser.partnerId);
          setPlans(trainingPlans);
          if (trainingPlans.length > 0 && !selectedPlanId) {
            setSelectedPlanId(trainingPlans[0].id);
          }
        } else {
          setError("Could not retrieve your training plans. Partner ID is missing.");
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Error fetching training plans:', error.message);
        if (error.message?.includes('authentication') || error.message?.includes('Access Denied')) {
          setError('Unable to access training plans. Please try logging in again.');
        } else {
          setError('Unable to connect to server. Please check your connection and try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [authService, odooClientService, selectedPlanId]);

  useEffect(() => {
    const fetchPlanDetails = async () => {
      if (!selectedPlanId) return;

      const planSummary = plans.find(p => p.id === selectedPlanId);
      if (!planSummary) return;

      try {
        const tasks = await odooClientService.getTrainingPlanTasks(selectedPlanId);
        setSelectedPlan({ ...planSummary, tasks });
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error('Error fetching plan details:', error.message);
        setError('Could not load details for the selected plan.');
      }
    };

    fetchPlanDetails();
  }, [selectedPlanId, plans, odooClientService]);

  if (loading) {
    return <div className="p-4">Loading training plans...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Your Plans</h1>
        <Link 
          href="/client-area/dashboard/training/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Plan
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {plans.map(plan => (
            <TrainingPlanCard
              key={plan.id}
              plan={plan as ProcessedTrainingPlan} // Cast here, tasks will be added when selected
              isSelected={selectedPlanId === plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </div>
        <div className="lg:col-span-2">
          {selectedPlan ? (
            <TrainingPlanDetail plan={selectedPlan} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 text-center text-black">
              Select a training plan to view details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Export the page component directly. Suspense is handled internally if needed.
export default function TrainingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}> 
      <TrainingContent />
    </Suspense>
  );
} 