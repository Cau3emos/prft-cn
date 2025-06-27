"use client";
import { useState, useEffect } from "react";
import questions from "./questions.json";

const DIMENSIONS = [...new Set(questions.map(q => q.dimension))];

export default function TestPage() {
  const [answers, setAnswers] = useState({});
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
          {Object.entries(result.scores).map(([dim, val]) => (
            <li key={dim} className="border-b pb-1">
              {dim}：{val.toFixed(1)} 分（{val < 4 ? '低风险' : val < 7 ? '中风险' : '高风险'}）
            </li>
          ))}
        </ul>
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
