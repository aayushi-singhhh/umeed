import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Brain, Target, Calendar, Zap, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';

interface LearningTrajectory {
  skill: string;
  current_level: number;
  predicted_level: number;
  confidence: number;
  trajectory: 'improving' | 'stable' | 'declining';
  key_factors: string[];
}

interface InterventionTiming {
  skill: string;
  current_performance: number;
  optimal_timing: string;
  intervention_type: string;
  expected_improvement: string;
  confidence: number;
}

interface AnalyticsData {
  performance_trends: {
    [key: string]: {
      current: number;
      trend: string;
      prediction: string;
    };
  };
  learning_patterns: {
    best_learning_time: string;
    optimal_session_length: string;
    engagement_drivers: string[];
    challenge_areas: string[];
  };
  intervention_recommendations: Array<{
    area: string;
    recommendation: string;
    expected_impact: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  milestone_predictions: Array<{
    skill: string;
    current: string;
    predicted: string;
  }>;
}

export const PredictiveAnalyticsDashboard: React.FC = () => {
  const [trajectoryData, setTrajectoryData] = useState<LearningTrajectory[]>([]);
  const [interventionData, setInterventionData] = useState<InterventionTiming[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'trajectory' | 'interventions' | 'analytics' | 'population'>('trajectory');
  const [populationInsights, setPopulationInsights] = useState<any>(null);

  const API_BASE_URL = 'http://localhost:5001';

  // Load learning trajectory prediction
  const loadTrajectoryPrediction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/predict_trajectory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          child_id: 'child1',
          historical_data: [
            { date: '2024-01-01', reading_score: 65, math_score: 58, attention_span: 12 },
            { date: '2024-02-01', reading_score: 68, math_score: 62, attention_span: 14 },
            { date: '2024-03-01', reading_score: 72, math_score: 65, attention_span: 15 }
          ]
        }),
      });

      const result = await response.json();
      if (result.success && result.trajectory) {
        setTrajectoryData(result.trajectory);
      }
    } catch (error) {
      console.error('Error loading trajectory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load intervention timing recommendations
  const loadInterventionTiming = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/intervention_timing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          child_id: 'child1',
          current_performance: {
            reading: 72,
            math: 65,
            attention: 78,
            social_skills: 68
          }
        }),
      });

      const result = await response.json();
      if (result.success && result.interventions) {
        setInterventionData(result.interventions);
      }
    } catch (error) {
      console.error('Error loading interventions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load comprehensive analytics dashboard
  const loadAnalyticsDashboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/learning_analytics_dashboard?child_id=child1`);
      const result = await response.json();
      
      if (result.success && result.analytics) {
        setAnalyticsData(result.analytics);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load population insights
  const loadPopulationInsights = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/population_insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          school_data: [
            { school_id: 'school1', total_students: 250, with_learning_differences: 45 },
            { school_id: 'school2', total_students: 180, with_learning_differences: 32 }
          ]
        }),
      });

      const result = await response.json();
      if (result.success && result.insights) {
        setPopulationInsights(result.insights);
      }
    } catch (error) {
      console.error('Error loading population insights:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrajectoryPrediction();
    loadInterventionTiming();
    loadAnalyticsDashboard();
    loadPopulationInsights();
  }, []);

  const getTrajectoryColor = (trajectory: string) => {
    switch (trajectory) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'stable': return 'text-blue-600 bg-blue-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderTrajectoryTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trajectoryData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">{item.skill}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrajectoryColor(item.trajectory)}`}>
                {item.trajectory}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Current:</span>
                <span className="font-medium">{item.current_level}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Predicted:</span>
                <span className="font-medium text-green-600">{item.predicted_level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${item.current_level}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                Confidence: {item.confidence}%
              </div>
            </div>
            
            {item.key_factors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-600 mb-1">Key Factors:</p>
                <div className="flex flex-wrap gap-1">
                  {item.key_factors.slice(0, 2).map((factor, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                      {factor}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {trajectoryData.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No trajectory data available. Start by analyzing some learning sessions!</p>
        </div>
      )}
    </div>
  );

  const renderInterventionsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {interventionData.map((item, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.skill}</h3>
                <p className="text-gray-600 text-sm">Current: {item.current_performance}%</p>
              </div>
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="font-medium text-blue-900 text-sm">Optimal Timing</p>
                <p className="text-blue-700">{item.optimal_timing}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="font-medium text-green-900 text-sm">Intervention Type</p>
                <p className="text-green-700">{item.intervention_type}</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="font-medium text-purple-900 text-sm">Expected Improvement</p>
                <p className="text-purple-700">{item.expected_improvement}</p>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm text-gray-600">Confidence</span>
                <span className="font-medium">{item.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {interventionData.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No intervention recommendations available yet.</p>
        </div>
      )}
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      {analyticsData && (
        <>
          {/* Performance Trends */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Performance Trends
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analyticsData.performance_trends).map(([skill, data]) => (
                <div key={skill} className="text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 capitalize">{skill}</h4>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{data.current}%</p>
                    <p className="text-sm text-green-600 mt-1">{data.trend}</p>
                    <p className="text-xs text-gray-500 mt-2">{data.prediction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Patterns */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Brain className="h-5 w-5 mr-2 text-purple-600" />
              Learning Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="font-medium">Best Learning Time</p>
                      <p className="text-gray-600">{analyticsData.learning_patterns.best_learning_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium">Optimal Session Length</p>
                      <p className="text-gray-600">{analyticsData.learning_patterns.optimal_session_length}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium flex items-center">
                      <Zap className="h-4 w-4 text-yellow-600 mr-2" />
                      Engagement Drivers
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analyticsData.learning_patterns.engagement_drivers.map((driver, index) => (
                        <span key={index} className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                          {driver}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium flex items-center">
                      <AlertTriangle className="h-4 w-4 text-red-600 mr-2" />
                      Challenge Areas
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analyticsData.learning_patterns.challenge_areas.map((area, index) => (
                        <span key={index} className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Intervention Recommendations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-orange-600" />
              Intervention Recommendations
            </h3>
            <div className="space-y-3">
              {analyticsData.intervention_recommendations.map((rec, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-gray-900">{rec.area}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{rec.recommendation}</p>
                      <p className="text-green-600 text-sm flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {rec.expected_impact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const renderPopulationTab = () => (
    <div className="space-y-6">
      {populationInsights && (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Population Insights
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-blue-900">Success Rate</h4>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {populationInsights.overall_success_rate}%
                </p>
                <p className="text-sm text-blue-700 mt-1">Across all interventions</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-green-900">Average Improvement</h4>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {populationInsights.average_improvement}%
                </p>
                <p className="text-sm text-green-700 mt-1">Per 6-week period</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <h4 className="font-semibold text-purple-900">Students Helped</h4>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  {populationInsights.total_students_helped}
                </p>
                <p className="text-sm text-purple-700 mt-1">This school year</p>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium mb-3">Most Effective Interventions</h4>
              <div className="space-y-2">
                {populationInsights.effective_interventions?.map((intervention: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{intervention.name}</span>
                    <span className="text-green-600 font-semibold">{intervention.success_rate}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      
      {!populationInsights && !isLoading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Population insights will be available once more data is collected.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Predictive Analytics Dashboard</h1>
                <p className="text-gray-600">AI-powered learning insights and predictions</p>
              </div>
            </div>
            
            {isLoading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Analyzing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'trajectory', label: 'Learning Trajectory', icon: TrendingUp },
              { id: 'interventions', label: 'Interventions', icon: Target },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'population', label: 'Population', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'trajectory' && renderTrajectoryTab()}
          {activeTab === 'interventions' && renderInterventionsTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'population' && renderPopulationTab()}
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalyticsDashboard;
