const express = require('express');
const router = express.Router();
const {
  getSeries,
  createSeries,
  updateSeries,
  deleteSeries,
} = require('../controllers/seriesController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Series
 *   description: Series management
 */

/**
 * @swagger
 * /api/series:
 *   get:
 *     summary: Get all series
 *     tags: [Series]
 *     responses:
 *       200:
 *         description: A list of series
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Series'
 *   post:
 *     summary: Create a new series
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Series'
 *     responses:
 *       201:
 *         description: Series created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.route('/').get(getSeries).post(protect, createSeries);

/**
 * @swagger
 * /api/series/{id}:
 *   put:
 *     summary: Update a series
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The series ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Series'
 *     responses:
 *       200:
 *         description: Series updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Series not found
 *   delete:
 *     summary: Delete a series
 *     tags: [Series]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The series ID
 *     responses:
 *       200:
 *         description: Series deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Series not found
 */
router.route('/:id').put(protect, updateSeries).delete(protect, deleteSeries);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Series:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the series
 *         name:
 *           type: string
 *           description: The name of the series
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the series was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the series was last updated
 */
