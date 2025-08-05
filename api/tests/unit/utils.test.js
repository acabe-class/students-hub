import { catchAsync, sendResponse } from '../../src/lib/utils.js';

describe('Utility Functions', () => {
  describe('catchAsync', () => {
    it('should execute async function successfully', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const wrappedFn = catchAsync(mockFn);
      
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should catch errors and pass them to next', async () => {
      const error = new Error('Test error');
      const mockFn = jest.fn().mockRejectedValue(error);
      const wrappedFn = catchAsync(mockFn);
      
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle synchronous errors', async () => {
      const error = new Error('Sync error');
      const mockFn = jest.fn().mockImplementation(() => {
        throw error;
      });
      const wrappedFn = catchAsync(mockFn);
      
      const mockReq = {};
      const mockRes = {};
      const mockNext = jest.fn();

      await wrappedFn(mockReq, mockRes, mockNext);

      expect(mockFn).toHaveBeenCalledWith(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('sendResponse', () => {
    it('should send successful response with data', () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const statusCode = 200;
      const message = 'Success message';
      const data = { key: 'value' };

      sendResponse(mockRes, statusCode, message, data);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data
      });
    });

    it('should send successful response without data', () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const statusCode = 204;
      const message = 'No content';

      sendResponse(mockRes, statusCode, message);

      expect(mockRes.status).toHaveBeenCalledWith(statusCode);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data: null
      });
    });

    it('should handle different status codes', () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const testCases = [
        { statusCode: 200, message: 'OK' },
        { statusCode: 201, message: 'Created' },
        { statusCode: 400, message: 'Bad Request' },
        { statusCode: 404, message: 'Not Found' },
        { statusCode: 500, message: 'Internal Server Error' }
      ];

      testCases.forEach(({ statusCode, message }) => {
        sendResponse(mockRes, statusCode, message);
        
        expect(mockRes.status).toHaveBeenCalledWith(statusCode);
        expect(mockRes.json).toHaveBeenCalledWith({
          success: true,
          message,
          data: null
        });
      });
    });

    it('should handle complex data structures', () => {
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      const complexData = {
        users: [
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 2
        }
      };

      sendResponse(mockRes, 200, 'Users retrieved', complexData);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Users retrieved',
        data: complexData
      });
    });
  });
}); 