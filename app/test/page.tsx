"use client";

import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer
} from 'recharts';


import { useEffect, useRef } from "react";
useState, useEffect } from "react";
import questions from "./questions.json";

const DIMENSIONS = [...new Set(questions.map(q => q.dimension))];

export default function TestPage() {
  
  const [answers, setAnswers] = useState({});
  const [answerLog, setAnswerLog] = useState<{ id: number, value: string, duration: number }[]>([]);
  const currentQuestionTime = useRef(Date.now());
  const startTimeRef = useRef(Date.now());
        
  const [step, setStep] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setStartTime(Date.now());
  }, []);

  const current = questions[step];

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [current.id]: val }));
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      computeResults();
    }
  };

  const computeResults = () => {
    const scores: { [key: string]: number[] } = {};
    questions.forEach(q => {
      if (!scores[q.dimension]) scores[q.dimension] = [];
      scores[q.dimension].push(answers[q.id] || 0);
    });

    const resultData = Object.fromEntries(
      Object.entries(scores).map(([dim, vals]) => [
        dim,
        vals.reduce((a, b) => a + b, 0) / vals.length,
      ])
    );

    const duration = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0;
    setResult({ scores: resultData, duration });
  };

  if (result) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">测评结果</h1>
        <p>用时：{result.duration} 秒</p>
        <ul className="mt-4 space-y-2">
          {Object.entries(result.scores as { [key: string]: number }).map(([dim, val]) => (
            <li key={dim} className="border-b pb-1">
              {dim}：{val.toFixed(1)} 分（{val < 4 ? '低风险' : val < 7 ? '中风险' : '高风险'}）
            </li>
          ))}
        </ul>
        <div className="h-[500px] w-full my-6">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={
              Object.entries(result.scores as { [key: string]: number }).map(([dim, val]) => ({
                dimension: dim,
                score: parseFloat(val.toFixed(1))
              }))
            }>
              <PolarGrid />
              <PolarAngleAxis dataKey="dimension" />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              <Radar name="分数" dataKey="score" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-2">第 {step + 1} 题 / {questions.length}</h2>
      <p className="mb-4">{current.text}</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(v => (
          <button key={v} onClick={() => handleAnswer(v)} className="px-4 py-2 border rounded hover:bg-gray-100">{v}</button>
        ))}
      </div>
    </div>
  );
}
