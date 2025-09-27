import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { parseResume } from '../../utils/resumeParser';
import { setCandidateInfo } from '../../store/slices/interviewSlice';

const ResumeUpload: React.FC = () => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFile = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF or DOCX file.');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const parsedData = await parseResume(file);
      
      dispatch(setCandidateInfo({
        name: parsedData.name,
        email: parsedData.email,
        phone: parsedData.phone,
        resumeContent: parsedData.content,
        resumeFileName: file.name,
      }));

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-secondary-900 mb-3">Upload Your Resume</h2>
        <p className="text-secondary-600 max-w-md mx-auto">
          Upload your resume to personalize the interview experience. We'll analyze your background 
          and tailor questions accordingly.
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-primary-400 bg-primary-50 scale-105'
            : 'border-secondary-300 hover:border-primary-400 hover:bg-primary-50/50'
        } ${isProcessing ? 'pointer-events-none opacity-50' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600 mb-6"></div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-secondary-900">Processing your resume</p>
              <p className="text-sm text-secondary-600">This may take a few moments...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="h-10 w-10 text-primary-600" />
            </div>
            <div className="space-y-4">
              <p className="text-xl font-semibold text-secondary-900">
                Drop your resume here, or{' '}
                <label className="text-primary-600 hover:text-primary-700 cursor-pointer underline transition-colors">
                  browse files
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.docx"
                    onChange={handleFileInput}
                  />
                </label>
              </p>
              <p className="text-secondary-500">PDF or DOCX files up to 10MB</p>
            </div>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start space-x-3 p-4 bg-danger-50 border border-danger-200 rounded-xl">
          <AlertCircle className="h-5 w-5 text-danger-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-danger-900">Upload Error</p>
            <p className="text-sm text-danger-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="flex items-start space-x-3 p-4 bg-success-50 border border-success-200 rounded-xl">
          <CheckCircle className="h-5 w-5 text-success-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-success-900">Resume Uploaded Successfully!</p>
            <p className="text-sm text-success-700 mt-1">
              Your resume has been processed. Please review your information in the next step.
            </p>
          </div>
        </div>
      )}

      {/* Supported Formats */}
      <div className="bg-secondary-50 border border-secondary-200 rounded-xl p-6">
        <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Supported File Formats
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-secondary-200">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-secondary-900">PDF Documents</p>
              <p className="text-xs text-secondary-600">Portable Document Format</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-secondary-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-secondary-900">DOCX Files</p>
              <p className="text-xs text-secondary-600">Microsoft Word Documents</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;