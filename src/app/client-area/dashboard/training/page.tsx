"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { OdooService } from "@/services/odoo/OdooService";
import { format } from "date-fns";
import { config } from "@/config/config";

// Initialize OdooService
const odooService = new OdooService({
  baseUrl: config.odoo.baseUrl,
  database: config.odoo.database
});

const calculateProgress = (tasks: any[]) => {
  if (!tasks || tasks.length === 0) return 0;
  const completedTasks = tasks.filter(task => task.stage_id[0] === 4).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

const sanitizeHtml = (html: string) => {
  if (!html) return '';
  return html
    .replace(/<\/?[^>]+(>|$)/g, "") // Remove HTML tags
    .replace(/&lt;p&gt;|&lt;\/p&gt;/g, "") // Remove encoded <p> tags
    .replace(/"<p>"|"<\/p>"/g, "") // Remove quoted <p> tags
    .replace(/<p>|<\/p>/g, "") // Remove literal <p> tags
    .trim(); // Remove extra whitespace
};

// Components
const TrainingPlanCard = ({ plan, isSelected, onClick }: { plan: any; isSelected: boolean; onClick: () => void }) => {
  const progress = calculateProgress(plan.tasks);
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 mb-4 cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? 'border-2 border-blue-500' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        <span className="text-sm text-gray-500">
          {format(new Date(plan.date_start), 'MMM d, yyyy')} - {format(new Date(plan.date), 'MMM d, yyyy')}
        </span>
      </div>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium">Progress</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="mt-2">
        <span className="text-sm text-gray-500">{plan.tasks.length} Tasks</span>
      </div>
    </div>
  );
};

// Component for displaying the task status
const TaskStatus = ({ status }: { status: number }) => {
  switch (status) {
    case 4: // Done
      return (
        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
          Completed
        </span>
      );
    case 2: // In Progress
      return (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
          In Progress
        </span>
      );
    default: // To Do
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
          Not Started
        </span>
      );
  }
};

// Component for the detailed view of a training plan
const TrainingPlanDetail = ({ plan }: { plan: any }) => {
  const progress = calculateProgress(plan.tasks);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {format(new Date(plan.date_start), 'MMM d, yyyy')} - {format(new Date(plan.date), 'MMM d, yyyy')}
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {progress}% Complete
          </span>
        </div>
      </div>
      
      {plan.description && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-600">{sanitizeHtml(plan.description)}</p>
        </div>
      )}

      <div>
        <h3 className="text-lg font-semibold mb-4">Tasks & Skills</h3>
        <div className="space-y-4">
          {plan.tasks.map((task: any) => (
            <div key={task.id} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-lg mb-1">{task.name}</h4>
                  {task.description && (
                    <p className="text-gray-600">{sanitizeHtml(task.description)}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.stage_id[0] === 4 
                    ? 'bg-green-100 text-green-800'
                    : task.stage_id[0] === 2
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {task.stage_id[1] || 'Not Started'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// TrainingContent is a client component that uses useSearchParams
const TrainingContent = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const trainingPlans = await odooService.getTrainingPlans();
        setPlans(trainingPlans);
        if (trainingPlans.length > 0 && !selectedPlanId) {
          setSelectedPlanId(trainingPlans[0].id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load training plans');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  if (loading) {
    return <div className="p-4">Loading training plans...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  const selectedPlan = plans.find(plan => plan.id === selectedPlanId);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Plans</h1>
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
              plan={plan}
              isSelected={plan.id === selectedPlanId}
              onClick={() => setSelectedPlanId(plan.id)}
            />
          ))}
        </div>
        
        <div className="lg:col-span-2">
          {selectedPlan && <TrainingPlanDetail plan={selectedPlan} />}
        </div>
      </div>
    </div>
  );
};

// Main page component that wraps the client component in a Suspense boundary
export default function TrainingPage() {
  return (
    <Suspense fallback={
      <div className="space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-sky-800">Training Plans</h1>
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-600"></div>
        </div>
      </div>
    }>
      <TrainingContent />
    </Suspense>
  );
} 