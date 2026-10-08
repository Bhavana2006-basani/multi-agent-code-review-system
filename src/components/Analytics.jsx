import { useState } from "react";
import Header from "./Header";

import {
  Bug,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Wrench,
  FileWarning,
  ScanSearch,
  Activity,
  BrainCircuit,
  GitMerge,
  Trophy,
  Eye,
  EyeOff,
  Copy,
  Check,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";


function Analytics({ analysisData }) {

  // =====================================================
  // UI STATE
  // =====================================================

  const [visibleCandidate, setVisibleCandidate] = useState(null);
  const [showFinalCode, setShowFinalCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);


  // =====================================================
  // REAL BACKEND DATA
  // =====================================================

  const staticSummary =
    analysisData?.static_analysis?.summary || {};

  const securitySummary =
    analysisData?.security_analysis?.summary || {};

  const rawStaticFindings =
    analysisData?.static_analysis?.findings || [];

  const rawSecurityFindings =
    analysisData?.security_analysis?.findings || [];

  const aiReview =
    analysisData?.ai_review || {};

  const decision =
    analysisData?.decision || {};

  const candidates =
    Array.isArray(aiReview?.candidates)
      ? aiReview.candidates
      : [];


  // =====================================================
  // STATIC ANALYSIS VALUES
  // =====================================================

  const errors =
    staticSummary.errors ?? 0;

  const warnings =
    staticSummary.warnings ?? 0;

  const refactor =
    staticSummary.refactor ?? 0;

  const convention =
    staticSummary.convention ?? 0;

  const totalStaticFindings =
    staticSummary.total_findings ??
    rawStaticFindings.length;


  // =====================================================
  // SECURITY ANALYSIS VALUES
  // =====================================================

  const high =
    securitySummary.high ?? 0;

  const medium =
    securitySummary.medium ?? 0;

  const low =
    securitySummary.low ?? 0;

  const totalSecurityFindings =
    securitySummary.total_findings ??
    rawSecurityFindings.length;


  // =====================================================
  // DERIVED SCORES
  // =====================================================

  const codeQualityScore = Math.max(
    0,
    100 -
      errors * 15 -
      warnings * 5 -
      refactor * 3 -
      convention * 2
  );

  const securityScore = Math.max(
    0,
    100 -
      high * 20 -
      medium * 10 -
      low * 5
  );

  const maintainabilityScore = Math.max(
    0,
    100 -
      errors * 12 -
      warnings * 4 -
      refactor * 6 -
      convention * 2
  );

  const readabilityScore = Math.max(
    0,
    100 -
      convention * 8 -
      warnings * 4
  );

  const reliabilityScore = Math.max(
    0,
    100 -
      errors * 20 -
      warnings * 5
  );

  const standardsScore = Math.max(
    0,
    100 -
      convention * 10
  );

  const refactorScore = Math.max(
    0,
    100 -
      refactor * 12
  );


  // =====================================================
  // DECISION AGENT VALUES
  // =====================================================

  const finalOptimizedScore =
    decision?.success
      ? decision.overall_score ?? 0
      : 0;

  const selectedCandidateId =
    decision?.selected_candidate_id ?? "--";

  const selectedCandidateName =
    decision?.selected_candidate_name ??
    "Not Selected";

  const selectedScores =
    decision?.selected_scores || {};

  const finalOptimizedCode =
    decision?.final_optimized_code || "";


  // =====================================================
  // OVERALL HEALTH
  // =====================================================

  const overallHealth = Math.round(
    (
      codeQualityScore +
      securityScore +
      maintainabilityScore
    ) / 3
  );


  // =====================================================
  // STATIC FINDINGS CHART
  // =====================================================

  const staticFindings = [
    {
      name: "Errors",
      count: errors,
    },
    {
      name: "Warnings",
      count: warnings,
    },
    {
      name: "Refactor",
      count: refactor,
    },
    {
      name: "Convention",
      count: convention,
    },
  ];


  // =====================================================
  // SECURITY SEVERITY
  // =====================================================

  const severityData = [
    {
      name: "High",
      value: high,
    },
    {
      name: "Medium",
      value: medium,
    },
    {
      name: "Low",
      value: low,
    },
  ];


  // =====================================================
  // CODE QUALITY RADAR
  // =====================================================

  const codeQualityRadar = [
    {
      metric: "Readability",
      value: readabilityScore,
    },
    {
      metric: "Maintainability",
      value: maintainabilityScore,
    },
    {
      metric: "Reliability",
      value: reliabilityScore,
    },
    {
      metric: "Standards",
      value: standardsScore,
    },
    {
      metric: "Refactor Health",
      value: refactorScore,
    },
  ];


  // =====================================================
  // SECURITY FINDING TYPES
  // =====================================================

  const findingTypeMap = {};

  rawSecurityFindings.forEach((finding) => {

    const name =
      finding.test_name ||
      finding.test_id ||
      "Other";

    if (!findingTypeMap[name]) {
      findingTypeMap[name] = 0;
    }

    findingTypeMap[name] += 1;
  });

  const securityFindingTypes =
    Object.entries(findingTypeMap).map(
      ([name, count]) => ({
        name,
        count,
      })
    );


  // =====================================================
  // SECURITY CATEGORIES
  // =====================================================

  const vulnerabilityMap = {
    "Hardcoded Secrets": 0,
    "Command / Process": 0,
    "Unsafe Functions": 0,
    "Other": 0,
  };

  rawSecurityFindings.forEach((finding) => {

    const text = `${finding.test_name || ""} ${
      finding.message || ""
    }`.toLowerCase();

    if (
      text.includes("password") ||
      text.includes("hardcoded") ||
      text.includes("secret")
    ) {

      vulnerabilityMap["Hardcoded Secrets"] += 1;

    } else if (
      text.includes("subprocess") ||
      text.includes("shell") ||
      text.includes("command")
    ) {

      vulnerabilityMap["Command / Process"] += 1;

    } else if (
      text.includes("unsafe") ||
      text.includes("exec") ||
      text.includes("eval")
    ) {

      vulnerabilityMap["Unsafe Functions"] += 1;

    } else {

      vulnerabilityMap["Other"] += 1;
    }
  });

  const vulnerabilityCategories =
    Object.entries(vulnerabilityMap)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value,
      }));

  const categoryColors = [
    "#38bdf8",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
  ];


  // =====================================================
  // AGENT 03 CANDIDATE SCORES
  // =====================================================

  const candidateComparison =
    candidates.map((candidate) => {

      const scores =
        candidate.estimated_scores || {};

      const averageScore = Math.round(
        (
          (scores.security ?? 0) +
          (scores.readability ?? 0) +
          (scores.maintainability ?? 0) +
          (scores.performance ?? 0) +
          (scores.reliability ?? 0)
        ) / 5
      );

      return {
        name: `Candidate ${candidate.candidate_id}`,
        score: averageScore,
      };
    });


  // =====================================================
  // DECISION COMPARISON
  // =====================================================

  const decisionComparison =
    Array.isArray(decision?.candidate_comparison)
      ? decision.candidate_comparison.map(
          (candidate) => ({
            name: `Candidate ${candidate.candidate_id}`,
            score: candidate.overall_score ?? 0,
          })
        )
      : [];


  // =====================================================
  // SELECTED CANDIDATE RADAR
  // =====================================================

  const selectedCandidateRadar = [
    {
      metric: "Security",
      value: selectedScores.security ?? 0,
    },
    {
      metric: "Readability",
      value: selectedScores.readability ?? 0,
    },
    {
      metric: "Maintainability",
      value: selectedScores.maintainability ?? 0,
    },
    {
      metric: "Performance",
      value: selectedScores.performance ?? 0,
    },
    {
      metric: "Reliability",
      value: selectedScores.reliability ?? 0,
    },
  ];


  // =====================================================
  // SCORE LABEL
  // =====================================================

  const getScoreLabel = (score) => {

    if (score >= 90) {
      return "EXCELLENT";
    }

    if (score >= 75) {
      return "GOOD";
    }

    if (score >= 60) {
      return "MODERATE";
    }

    return "NEEDS REVIEW";
  };


  // =====================================================
  // VIEW CANDIDATE CODE
  // =====================================================

  const toggleCandidate = (candidateId) => {

    setVisibleCandidate(
      visibleCandidate === candidateId
        ? null
        : candidateId
    );
  };


  // =====================================================
  // COPY CODE
  // =====================================================

  const copyCode = async (code, id) => {

    try {

      await navigator.clipboard.writeText(code);

      setCopiedCode(id);

      setTimeout(() => {
        setCopiedCode(null);
      }, 1800);

    } catch (error) {

      console.error(
        "Unable to copy code:",
        error
      );
    }
  };


  // =====================================================
  // NO ANALYSIS
  // =====================================================

  if (!analysisData) {

    return (

      <div>

        <Header
          title="Analysis Insights"
          subtitle="Multi-agent code quality, security and optimization intelligence"
        />

        <div
          className="enterprise-chart-card"
          style={{
            marginTop: "30px",
            padding: "50px",
            textAlign: "center",
          }}
        >

          <ScanSearch
            size={45}
            style={{
              marginBottom: "15px",
            }}
          />

          <h2>
            No Analysis Data Available
          </h2>

          <p
            style={{
              color: "#94a3b8",
              marginTop: "10px",
            }}
          >
            Go to Code Analyzer, submit Python code and run
            the multi-agent analysis. Real Pylint, Bandit,
            AI Review and Decision Agent insights will appear here.
          </p>

        </div>

      </div>
    );
  }


  return (

    <div>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <Header
        title="Analysis Insights"
        subtitle="Real multi-agent intelligence from the latest source code analysis"
      />


      {/* =====================================================
          KPI SECTION
      ===================================================== */}

      <div className="enterprise-section-heading">
        <span>
          KEY PERFORMANCE INDICATORS
        </span>
      </div>


      <div className="enterprise-kpi-grid">

        <div className="enterprise-kpi-card">

          <div className="kpi-card-top">

            <span>
              Code Quality Score
            </span>

            <Bug size={19} />

          </div>

          <h2>
            {codeQualityScore}/100
          </h2>

          <p>
            Pylint quality assessment
          </p>

        </div>


        <div className="enterprise-kpi-card">

          <div className="kpi-card-top">

            <span>
              Security Score
            </span>

            <ShieldCheck size={19} />

          </div>

          <h2>
            {securityScore}/100
          </h2>

          <p>
            Bandit security assessment
          </p>

        </div>


        <div className="enterprise-kpi-card">

          <div className="kpi-card-top">

            <span>
              Maintainability
            </span>

            <Wrench size={19} />

          </div>

          <h2>
            {maintainabilityScore}/100
          </h2>

          <p>
            Derived from Pylint findings
          </p>

        </div>


        <div className="enterprise-kpi-card">

          <div className="kpi-card-top">

            <span>
              Static Findings
            </span>

            <FileWarning size={19} />

          </div>

          <h2>
            {totalStaticFindings}
          </h2>

          <p>
            Pylint detected findings
          </p>

        </div>


        <div className="enterprise-kpi-card">

          <div className="kpi-card-top">

            <span>
              Security Findings
            </span>

            <ShieldAlert size={19} />

          </div>

          <h2>
            {totalSecurityFindings}
          </h2>

          <p>
            Bandit detected findings
          </p>

        </div>


        <div className="enterprise-kpi-card">

          <div className="kpi-card-top">

            <span>
              Final Optimized Score
            </span>

            <Trophy size={19} />

          </div>

          <h2>
            {decision?.success
              ? `${finalOptimizedScore}/100`
              : "--"}
          </h2>

          <p>
            Decision Agent final score
          </p>

        </div>

      </div>


      {/* =====================================================
          AGENT 01
      ===================================================== */}

      <div className="enterprise-section-heading analysis-heading">

        <div>

          <span>
            AGENT 01 — STATIC ANALYSIS
          </span>

          <p>
            Real Pylint code quality intelligence
          </p>

        </div>

        <Bug size={22} />

      </div>


      <div className="enterprise-chart-card enterprise-large-chart">

        <div className="enterprise-chart-header">

          <div>

            <h3>
              Static Findings by Category
            </h3>

            <p>
              Distribution of actual Pylint findings
            </p>

          </div>

          <ScanSearch size={20} />

        </div>


        <div className="enterprise-chart-body">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart data={staticFindings}>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1e293b"
              />

              <XAxis
                dataKey="name"
                stroke="#64748b"
              />

              <YAxis
                allowDecimals={false}
                stroke="#64748b"
              />

              <Tooltip />

              <Bar
                dataKey="count"
                fill="#38bdf8"
                radius={[7, 7, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>


      {/* =====================================================
          CODE QUALITY DETAILS
      ===================================================== */}

      <div className="enterprise-two-chart-grid">

        <div className="enterprise-chart-card">

          <div className="enterprise-chart-header">

            <div>

              <h3>
                Code Quality Components
              </h3>

              <p>
                Scores derived from Pylint analysis
              </p>

            </div>

            <Activity size={20} />

          </div>


          <div className="enterprise-small-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={codeQualityRadar}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="metric"
                  stroke="#64748b"
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#64748b"
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#38bdf8"
                  radius={[7, 7, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        <div className="enterprise-chart-card">

          <div className="enterprise-chart-header">

            <div>

              <h3>
                Code Quality Analysis
              </h3>

              <p>
                Pylint-derived quality indicators
              </p>

            </div>

            <Bug size={20} />

          </div>


          <div className="enterprise-small-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <RadarChart data={codeQualityRadar}>

                <PolarGrid stroke="#334155" />

                <PolarAngleAxis
                  dataKey="metric"
                  stroke="#94a3b8"
                />

                <PolarRadiusAxis
                  domain={[0, 100]}
                  stroke="#475569"
                />

                <Radar
                  dataKey="value"
                  stroke="#38bdf8"
                  fill="#38bdf8"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />

                <Tooltip />

              </RadarChart>

            </ResponsiveContainer>

          </div>


          <div className="quality-score-list">

            {codeQualityRadar.map(
              (item) => (

                <div
                  className="quality-score-item"
                  key={item.metric}
                >

                  <span>
                    {item.metric}
                  </span>

                  <strong>
                    {item.value}/100
                  </strong>

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          AGENT 02
      ===================================================== */}

      <div className="enterprise-section-heading analysis-heading">

        <div>

          <span>
            AGENT 02 — SECURITY ANALYSIS
          </span>

          <p>
            Real Bandit vulnerability intelligence
          </p>

        </div>

        <ShieldAlert size={22} />

      </div>


      <div className="enterprise-two-chart-grid">

        <div className="enterprise-chart-card">

          <div className="enterprise-chart-header">

            <div>

              <h3>
                Issue Distribution by Severity
              </h3>

              <p>
                Bandit findings grouped by severity
              </p>

            </div>

            <AlertTriangle size={20} />

          </div>


          <div className="enterprise-small-chart">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={severityData}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#64748b"
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  fill="#ef4444"
                  radius={[7, 7, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        <div className="enterprise-chart-card">

          <div className="enterprise-chart-header">

            <div>

              <h3>
                Vulnerability Categories
              </h3>

              <p>
                Categories from actual Bandit findings
              </p>

            </div>

            <ShieldAlert size={20} />

          </div>


          <div className="enterprise-small-chart">

            {vulnerabilityCategories.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={vulnerabilityCategories}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                  >

                    {vulnerabilityCategories.map(
                      (entry, index) => (

                        <Cell
                          key={entry.name}
                          fill={
                            categoryColors[
                              index %
                              categoryColors.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                }}
              >
                No security vulnerabilities detected
              </div>

            )}

          </div>


          <div className="enterprise-chart-legend">

            {vulnerabilityCategories.map(
              (item, index) => (

                <div key={item.name}>

                  <span
                    style={{
                      background:
                        categoryColors[
                          index %
                          categoryColors.length
                        ],
                    }}
                  ></span>

                  {item.name} ({item.value})

                </div>

              )
            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          SECURITY FINDING TYPES
      ===================================================== */}

      <div className="enterprise-chart-card enterprise-large-chart">

        <div className="enterprise-chart-header">

          <div>

            <h3>
              Security Finding Types
            </h3>

            <p>
              Actual vulnerabilities detected by Bandit
            </p>

          </div>

          <ShieldCheck size={20} />

        </div>


        <div className="enterprise-chart-body">

          {securityFindingTypes.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={securityFindingTypes}
                layout="vertical"
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#64748b"
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  width={170}
                  stroke="#64748b"
                />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#ef4444"
                  radius={[0, 7, 7, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              ✓ No Bandit security findings
            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          AGENT 03 — AI REVIEW
      ===================================================== */}

      <div className="enterprise-section-heading analysis-heading">

        <div>

          <span>
            AGENT 03 — AI REVIEW
          </span>

          <p>
            Gemini AI generated optimized code solutions
          </p>

        </div>

        <BrainCircuit size={22} />

      </div>


      <div className="enterprise-chart-card">

        <div className="enterprise-chart-header">

          <div>

            <h3>
              AI Candidate Scores
            </h3>

            <p>
              Average score of each generated optimized solution
            </p>

          </div>

          <BrainCircuit size={20} />

        </div>


        <div
          className="enterprise-small-chart"
          style={{
            height: "330px",
          }}
        >

          {candidateComparison.length > 0 ? (

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart data={candidateComparison}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e293b"
                />

                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                />

                <YAxis
                  domain={[0, 100]}
                  stroke="#64748b"
                />

                <Tooltip />

                <Bar
                  dataKey="score"
                  fill="#8b5cf6"
                  radius={[7, 7, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          ) : (

            <div
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              No AI candidates available
            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          GENERATED SOLUTIONS
      ===================================================== */}

      <div
        className="enterprise-chart-card"
        style={{
          marginTop: "24px",
          padding: "28px",
        }}
      >

        <div className="enterprise-chart-header">

          <div>

            <h3>
              Generated Solutions
            </h3>

            <p>
              Four complete optimized Python solutions generated by Agent 03
            </p>

          </div>

          <BrainCircuit size={22} />

        </div>


        {candidates.length > 0 ? (

          candidates.map((candidate) => {

            const scores =
              candidate.estimated_scores || {};

            const isVisible =
              visibleCandidate ===
              candidate.candidate_id;

            return (

              <div
                key={candidate.candidate_id}
                style={{
                  marginTop: "22px",
                  padding: "22px",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  background: "rgba(15, 23, 42, 0.45)",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                    flexWrap: "wrap",
                  }}
                >

                  <div>

                    <p
                      style={{
                        color: "#8b5cf6",
                        fontWeight: "700",
                        fontSize: "12px",
                        letterSpacing: "1px",
                        marginBottom: "7px",
                      }}
                    >
                      CANDIDATE {candidate.candidate_id}
                    </p>

                    <h3>
                      {candidate.name}
                    </h3>

                    <p
                      style={{
                        color: "#94a3b8",
                        marginTop: "7px",
                      }}
                    >
                      Focus: {candidate.focus}
                    </p>

                  </div>


                  <button
                    type="button"
                    onClick={() =>
                      toggleCandidate(
                        candidate.candidate_id
                      )
                    }
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      border: "1px solid #334155",
                      background: "#0f172a",
                      color: "#e2e8f0",
                      cursor: "pointer",
                    }}
                  >

                    {isVisible ? (
                      <EyeOff size={17} />
                    ) : (
                      <Eye size={17} />
                    )}

                    {isVisible
                      ? "Hide Optimized Code"
                      : "View Optimized Code"}

                  </button>

                </div>


                <p
                  style={{
                    marginTop: "15px",
                    color: "#cbd5e1",
                    lineHeight: "1.6",
                  }}
                >
                  {candidate.description}
                </p>


                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(130px, 1fr))",
                    gap: "10px",
                    marginTop: "18px",
                  }}
                >

                  {[
                    ["Security", scores.security],
                    ["Readability", scores.readability],
                    ["Maintainability", scores.maintainability],
                    ["Performance", scores.performance],
                    ["Reliability", scores.reliability],
                  ].map(([label, value]) => (

                    <div
                      key={label}
                      style={{
                        padding: "12px",
                        borderRadius: "8px",
                        background: "#0f172a",
                        border: "1px solid #1e293b",
                      }}
                    >

                      <span
                        style={{
                          color: "#94a3b8",
                          fontSize: "12px",
                        }}
                      >
                        {label}
                      </span>

                      <strong
                        style={{
                          display: "block",
                          marginTop: "5px",
                          fontSize: "17px",
                        }}
                      >
                        {value ?? 0}%
                      </strong>

                    </div>

                  ))}

                </div>


                <p
                  style={{
                    marginTop: "15px",
                    color: "#94a3b8",
                  }}
                >
                  <strong>
                    Time Complexity:
                  </strong>{" "}
                  {candidate.time_complexity ||
                    "Not available"}
                </p>


                {isVisible && (

                  <div
                    style={{
                      marginTop: "18px",
                    }}
                  >

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >

                      <strong>
                        Optimized Python Code
                      </strong>


                      <button
                        type="button"
                        onClick={() =>
                          copyCode(
                            candidate.optimized_code || "",
                            `candidate-${candidate.candidate_id}`
                          )
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "7px",
                          padding: "8px 12px",
                          borderRadius: "7px",
                          border: "1px solid #334155",
                          background: "#0f172a",
                          color: "#e2e8f0",
                          cursor: "pointer",
                        }}
                      >

                        {copiedCode ===
                        `candidate-${candidate.candidate_id}` ? (
                          <Check size={16} />
                        ) : (
                          <Copy size={16} />
                        )}

                        {copiedCode ===
                        `candidate-${candidate.candidate_id}`
                          ? "Copied"
                          : "Copy Code"}

                      </button>

                    </div>


                    <pre
                      style={{
                        padding: "20px",
                        borderRadius: "10px",
                        overflowX: "auto",
                        whiteSpace: "pre",
                        background: "#020617",
                        border: "1px solid #1e293b",
                        color: "#e2e8f0",
                        fontSize: "13px",
                        lineHeight: "1.65",
                        maxHeight: "500px",
                        overflowY: "auto",
                      }}
                    >
                      <code>
                        {candidate.optimized_code ||
                          "No optimized code returned."}
                      </code>
                    </pre>

                  </div>

                )}

              </div>

            );
          })

        ) : (

          <p
            style={{
              color: "#94a3b8",
              marginTop: "20px",
            }}
          >
            No optimized candidates available.
          </p>

        )}

      </div>


      {/* =====================================================
          AGENT 04
      ===================================================== */}

      <div className="enterprise-section-heading analysis-heading">

        <div>

          <span>
            AGENT 04 — DECISION AGENT
          </span>

          <p>
            Compares Agent 03 candidates and selects the best solution
          </p>

        </div>

        <GitMerge size={22} />

      </div>


      <div className="enterprise-two-chart-grid">

        <div className="enterprise-chart-card">

          <div className="enterprise-chart-header">

            <div>

              <h3>
                Decision Score Comparison
              </h3>

              <p>
                Weighted overall scores calculated by Agent 04
              </p>

            </div>

            <GitMerge size={20} />

          </div>


          <div className="enterprise-small-chart">

            {decisionComparison.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={decisionComparison}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                  />

                  <YAxis
                    domain={[0, 100]}
                    stroke="#64748b"
                  />

                  <Tooltip />

                  <Bar
                    dataKey="score"
                    fill="#10b981"
                    radius={[7, 7, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                }}
              >
                No Decision Agent data available
              </div>

            )}

          </div>

        </div>


        <div className="enterprise-chart-card">

          <div className="enterprise-chart-header">

            <div>

              <h3>
                Selected Candidate Profile
              </h3>

              <p>
                Quality profile of the final optimized solution
              </p>

            </div>

            <Trophy size={20} />

          </div>


          <div className="enterprise-small-chart">

            {decision?.success ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <RadarChart
                  data={selectedCandidateRadar}
                >

                  <PolarGrid
                    stroke="#334155"
                  />

                  <PolarAngleAxis
                    dataKey="metric"
                    stroke="#94a3b8"
                  />

                  <PolarRadiusAxis
                    domain={[0, 100]}
                    stroke="#475569"
                  />

                  <Radar
                    dataKey="value"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />

                  <Tooltip />

                </RadarChart>

              </ResponsiveContainer>

            ) : (

              <div
                style={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                }}
              >
                No selected candidate available
              </div>

            )}

          </div>

        </div>

      </div>


      {/* =====================================================
          FINAL BEST SOLUTION
      ===================================================== */}

      {decision?.success && (

        <div
          className="enterprise-chart-card"
          style={{
            marginTop: "24px",
            padding: "28px",
          }}
        >

          <div className="enterprise-chart-header">

            <div>

              <p
                style={{
                  color: "#10b981",
                  fontWeight: "700",
                  marginBottom: "8px",
                }}
              >
                🏆 BEST OPTIMIZED SOLUTION
              </p>

              <h2>
                Candidate {selectedCandidateId}
                {" — "}
                {selectedCandidateName}
              </h2>

            </div>

            <Trophy size={28} />

          </div>


          <div
            className="enterprise-kpi-grid"
            style={{
              marginTop: "25px",
            }}
          >

            <div className="enterprise-kpi-card">
              <span>Overall Score</span>
              <h2>{finalOptimizedScore}%</h2>
            </div>

            <div className="enterprise-kpi-card">
              <span>Security</span>
              <h2>{selectedScores.security ?? 0}%</h2>
            </div>

            <div className="enterprise-kpi-card">
              <span>Readability</span>
              <h2>{selectedScores.readability ?? 0}%</h2>
            </div>

            <div className="enterprise-kpi-card">
              <span>Maintainability</span>
              <h2>{selectedScores.maintainability ?? 0}%</h2>
            </div>

            <div className="enterprise-kpi-card">
              <span>Performance</span>
              <h2>{selectedScores.performance ?? 0}%</h2>
            </div>

            <div className="enterprise-kpi-card">
              <span>Reliability</span>
              <h2>{selectedScores.reliability ?? 0}%</h2>
            </div>

          </div>


          <p
            style={{
              marginTop: "22px",
              color: "#94a3b8",
              lineHeight: "1.7",
            }}
          >

            <strong>
              Decision:
            </strong>{" "}

            {decision.reason}

          </p>


          <p
            style={{
              marginTop: "12px",
              color: "#94a3b8",
            }}
          >

            <strong>
              Time Complexity:
            </strong>{" "}

            {decision.time_complexity ||
              "Not available"}

          </p>


          {/* FINAL CODE BUTTON */}

          <button
            type="button"
            onClick={() =>
              setShowFinalCode(
                !showFinalCode
              )
            }
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "22px",
              padding: "11px 17px",
              borderRadius: "8px",
              border: "1px solid #10b981",
              background: "rgba(16, 185, 129, 0.1)",
              color: "#10b981",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >

            {showFinalCode ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}

            {showFinalCode
              ? "Hide Final Optimized Code"
              : "View Final Optimized Code"}

          </button>


          {/* FINAL CODE */}

          {showFinalCode && (

            <div
              style={{
                marginTop: "18px",
              }}
            >

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >

                <strong>
                  Final Recommended Python Code
                </strong>


                <button
                  type="button"
                  onClick={() =>
                    copyCode(
                      finalOptimizedCode,
                      "final"
                    )
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "8px 12px",
                    borderRadius: "7px",
                    border: "1px solid #334155",
                    background: "#0f172a",
                    color: "#e2e8f0",
                    cursor: "pointer",
                  }}
                >

                  {copiedCode === "final" ? (
                    <Check size={16} />
                  ) : (
                    <Copy size={16} />
                  )}

                  {copiedCode === "final"
                    ? "Copied"
                    : "Copy Code"}

                </button>

              </div>


              <pre
                style={{
                  padding: "20px",
                  borderRadius: "10px",
                  overflowX: "auto",
                  whiteSpace: "pre",
                  background: "#020617",
                  border: "1px solid #10b981",
                  color: "#e2e8f0",
                  fontSize: "13px",
                  lineHeight: "1.65",
                  maxHeight: "550px",
                  overflowY: "auto",
                }}
              >
                <code>
                  {finalOptimizedCode ||
                    "Final optimized code is not available."}
                </code>
              </pre>

            </div>

          )}

        </div>

      )}


      {/* =====================================================
          CODE HEALTH SUMMARY
      ===================================================== */}

      <div className="enterprise-section-heading">

        <span>
          CODE HEALTH SUMMARY
        </span>

      </div>


      <div className="health-card-grid">

        <div className="health-card">

          <ShieldCheck size={22} />

          <span>
            Security
          </span>

          <h2>
            {securityScore}
          </h2>

          <p>
            {getScoreLabel(securityScore)}
          </p>

        </div>


        <div className="health-card">

          <Bug size={22} />

          <span>
            Code Quality
          </span>

          <h2>
            {codeQualityScore}
          </h2>

          <p>
            {getScoreLabel(codeQualityScore)}
          </p>

        </div>


        <div className="health-card">

          <Wrench size={22} />

          <span>
            Maintainability
          </span>

          <h2>
            {maintainabilityScore}
          </h2>

          <p>
            {getScoreLabel(
              maintainabilityScore
            )}
          </p>

        </div>


        <div className="health-card">

          <Activity size={22} />

          <span>
            Overall Health
          </span>

          <h2>
            {overallHealth}
          </h2>

          <p>
            {getScoreLabel(overallHealth)}
          </p>

        </div>

      </div>

    </div>

  );
}


export default Analytics;