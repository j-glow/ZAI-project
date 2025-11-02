const express = require('express');
const router = express.Router();
const {
  getMeasurements,
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
} = require('../controllers/measurementController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Measurements
 *   description: Measurement management
 */

/**
 * @swagger
 * /api/measurements:
 *   get:
 *     summary: Get all measurements
 *     tags: [Measurements]
 *     responses:
 *       200:
 *         description: A list of measurements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Measurement'
 *   post:
 *     summary: Create a new measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Measurement'
 *     responses:
 *       201:
 *         description: Measurement created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/').get(getMeasurements).post(protect, createMeasurement);

/**
 * @swagger
 * /api/measurements/{id}:
 *   put:
 *     summary: Update a measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The measurement ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Measurement'
 *     responses:
 *       200:
 *         description: Measurement updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Measurement not found
 *   delete:
 *     summary: Delete a measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The measurement ID
 *     responses:
 *       200:
 *         description: Measurement deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Measurement not found
 */
router.route('/:id').put(protect, updateMeasurement).delete(protect, deleteMeasurement);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Measurement:
 *       type: object
 *       required:
 *         - value
 *         - seriesId
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the measurement
 *         value:
 *           type: number
 *           description: The value of the measurement
 *         seriesId:
 *           type: integer
 *           description: The id of the series this measurement belongs to
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the measurement was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the measurement was last updated
 */
