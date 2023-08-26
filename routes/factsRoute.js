import express from 'express';
import { _getInterestingFact, _getProofSearchQuery, _getTop3Links, _createFactPost } from '../controllers/factsController.js';

const facts_router = express.Router();

// create a fact
facts_router.post('/create', _getInterestingFact)

// get a search query
facts_router.post('/query', _getProofSearchQuery)

// get 3 proof links
facts_router.post('/links', _getTop3Links)

// creating fact post 
facts_router.post('/new_fact_post', _createFactPost)



export default facts_router;