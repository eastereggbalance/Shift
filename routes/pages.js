const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const dataController = require('../controllers/getdata');

router.get('/', (req, res) =>
{
    if(req.headers.cookie)
    {
        return res.render('index', 
        {
            isLogined: true
        });
    }
    else
    {
        res.render('index');
    }
});

router.post('/api/shift', dataController.getShiftData);

router.get('/user/:userId', (req, res) =>
{
    const userId = req.params.userId;
    res.render('personal', {user: userId});
});

router.get('/setting/shift', (req, res) =>
{
    res.render('setting');
});

router.get('/login', (req, res) =>
{
    res.render('login');
});

router.get('/signup', (req, res) =>
{
    res.render('signup');
});

module.exports = router;