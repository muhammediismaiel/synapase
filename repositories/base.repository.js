/**
 * Base Repository Pattern Implementation
 * Provides common CRUD operations for any Mongoose model
 */
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data - Document data
   * @returns {Promise<Object>} Created document
   */
  async create(data) {
    try {
      const document = await this.model.create(data);
      return document;
    } catch (error) {
      throw new Error(`Failed to create document: ${error.message}`);
    }
  }

  /**
   * Find all documents with optional filtering and pagination
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options (sort, pagination, etc.)
   * @returns {Promise<Object>} Documents and pagination info
   */
  async findAll(filters = {}, options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        sort = { createdAt: -1 },
        select = '',
        populate = ''
      } = options;

      const skip = (page - 1) * limit;

      // Build query
      let query = this.model.find(filters);

      // Apply population if specified
      if (populate) {
        query = query.populate(populate);
      }

      // Apply field selection if specified
      if (select) {
        query = query.select(select);
      }

      // Apply sorting
      query = query.sort(sort);

      // Get total count for pagination
      const total = await this.model.countDocuments(filters);

      // Get documents with pagination
      const documents = await query.skip(skip).limit(limit);

      return {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to find documents: ${error.message}`);
    }
  }

  /**
   * Find document by ID
   * @param {String} id - Document ID
   * @param {Object} options - Query options (populate, select, etc.)
   * @returns {Promise<Object>} Document
   */
  async findById(id, options = {}) {
    try {
      const { populate = '', select = '' } = options;

      let query = this.model.findById(id);

      if (populate) {
        query = query.populate(populate);
      }

      if (select) {
        query = query.select(select);
      }

      const document = await query;

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      throw new Error(`Failed to find document by ID: ${error.message}`);
    }
  }

  /**
   * Update document by ID
   * @param {String} id - Document ID
   * @param {Object} data - Update data
   * @param {Object} options - Update options
   * @returns {Promise<Object>} Updated document
   */
  async update(id, data, options = {}) {
    try {
      const newOption = options.new !== undefined ? options.new : true;
      const runValidatorsOption = options.runValidators !== undefined ? options.runValidators : true;

      const document = await this.model.findByIdAndUpdate(
        id,
        data,
        { new: newOption, runValidators: runValidatorsOption }
      );

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      throw new Error(`Failed to update document: ${error.message}`);
    }
  }

  /**
   * Delete document by ID
   * @param {String} id - Document ID
   * @returns {Promise<Object>} Deleted document
   */
  async delete(id) {
    try {
      const document = await this.model.findByIdAndDelete(id);

      if (!document) {
        throw new Error('Document not found');
      }

      return document;
    } catch (error) {
      throw new Error(`Failed to delete document: ${error.message}`);
    }
  }

  /**
   * Count documents matching filters
   * @param {Object} filters - Query filters
   * @returns {Promise<Number>} Document count
   */
  async count(filters = {}) {
    try {
      return await this.model.countDocuments(filters);
    } catch (error) {
      throw new Error(`Failed to count documents: ${error.message}`);
    }
  }

  /**
   * Check if document exists
   * @param {String} id - Document ID
   * @returns {Promise<Boolean>} Document existence
   */
  async exists(id) {
    try {
      const document = await this.model.exists({ _id: id });
      return document !== null;
    } catch (error) {
      throw new Error(`Failed to check document existence: ${error.message}`);
    }
  }

  /**
   * Find one document by filters
   * @param {Object} filters - Query filters
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Document
   */
  async findOne(filters = {}, options = {}) {
    try {
      const { populate = '', select = '' } = options;

      let query = this.model.findOne(filters);

      if (populate) {
        query = query.populate(populate);
      }

      if (select) {
        query = query.select(select);
      }

      const document = await query;
      return document;
    } catch (error) {
      throw new Error(`Failed to find one document: ${error.message}`);
    }
  }
}
