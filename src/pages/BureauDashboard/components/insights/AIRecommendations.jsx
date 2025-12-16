
import React from "react";
import { LightBulbIcon, ExclamationTriangleIcon, InformationCircleIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

export default function AIRecommendations({ data }) {
    if (!data) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <LightBulbIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-slate-800">AI-rekommendationer</h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((rec) => (
                    <div key={rec.id} className={`p-4 rounded-xl border flex flex-col justify-between hover:shadow-md transition cursor-pointer ${rec.priority === 'high' ? 'bg-red-50 border-red-100' :
                            rec.priority === 'medium' ? 'bg-amber-50 border-amber-100' :
                                'bg-blue-50 border-blue-100'
                        }`}>
                        <div className="mb-3">
                            <div className="flex items-center gap-2 mb-2">
                                {rec.priority === 'high' && <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />}
                                {rec.priority === 'medium' && <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />}
                                {rec.priority === 'info' && <InformationCircleIcon className="w-5 h-5 text-blue-600" />}

                                <span className={`text-xs font-bold uppercase tracking-wide ${rec.priority === 'high' ? 'text-red-700' :
                                        rec.priority === 'medium' ? 'text-amber-700' :
                                            'text-blue-700'
                                    }`}>
                                    {rec.priority === 'high' ? 'Kritisk' : rec.priority === 'medium' ? 'Varning' : 'Info'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-800 font-medium leading-relaxed">{rec.text}</p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-3 border-t border-black/5">
                            <span className="text-xs font-semibold text-slate-500">{rec.action}</span>
                            <ArrowRightIcon className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
