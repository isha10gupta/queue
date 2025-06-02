import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-black dark:text-white py-10 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800 dark:text-blue-300 mb-6">
          Welcome to MSRIT-QUEUEBOT
        </h1>

        {/* Rules Box */}
        <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-6 rounded-lg shadow-md text-left max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">📌 Instructions & Rules</h2>
          <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
            <li>Upload <strong>Google LINKS</strong> only in the google drive.</li>
            <li>Respect <strong>queue timing</strong> & vendor policies.</li>
            <li>Collect your printouts <strong>within the estimated time</strong>.</li>
            <li>Submit honest <strong>feedback</strong> after printing. 📝</li>
            <li><strong>Payments must be made immediately</strong> after the print job is completed.</li>
            <li>⚠️ <strong>Fraudulent activity is strictly prohibited.</strong> Violators will be reported.</li>
            <li><strong>Only MSRIT College Emails</strong> (e.g., @msrit.edu) are allowed.</li>
            <li>Do not misuse/spam the system. It may lead to suspension.</li>
            <li>
              🏪 <strong>Available Vendors:</strong>
              <ol className="list-decimal pl-6 mt-1">
                <li>Gate 10 Stationary</li>
                <li>ESB Stationary</li>
                <li>Gate 11 Stationary</li>
                <li>Gate 10 Opposite Stationary</li>
                <li>College of Law Stationary</li>
              </ol>
            </li>
          </ul>
        </div>

        {/* Let's Print Button */}
        <Link
          to="/launch"
          className="inline-block mt-8 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow hover:bg-blue-800 transition-all"
        >
          🚀 Let's Print!
        </Link>
      </div>
    </div>
  );
};

export default Home;
