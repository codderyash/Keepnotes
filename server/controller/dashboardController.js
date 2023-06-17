

const Note = require('../model/Notes');
const mongoose = require('mongoose');

exports.dashboard = async (req, res) => {

  let perPage = 12;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    // Mongoose "^7.0.0 Update
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.count();

    res.render('dashboard/index', {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage)
    });
  } catch (error) {
    console.log(error);
  }
};




exports.viewnotes=async(req,res)=>{

  const note=await Note.findById({_id:req.params.id}).where({
    user:req.user.id
  }).lean();
  if(note)
  {

    res.render('dashboard/view_notes',{
      noteId:req.params.id,
      note,
      layout:'../views/layouts/dashboard'
    });

  }
  else
  {
        res.send('something went wrong')
  }


}


exports.updatenotes=async(req,res)=>{
try {

  await Note.findOneAndUpdate({
    _id:req.params.id
  },{title:req.body.title, body:req.body.body,updatedAt:Date.now()}).where({user:req.user.id});
  res.redirect('/dashboard');  
} catch (error) {
  console.log('error');
}
  
}

exports.deletenotes=async(req,res)=>{
  try {
    await Note.deleteOne({_id:req.params.id},{user:req.user.id});
      res.redirect('/dashboard');

  } catch (err) {
    console.log(err);
    
  }
}

exports.adddashboard=async(req,res)=>{
  res.render('dashboard/add',{
    layout:'../views/layouts/dashboard'
  });

}



exports.dashboardadd=async(req,res)=>{
    

  try {

    req.body.user=req.user.id;
    await Note.create(req.body);
    res.redirect('/dashboard');


    
  } catch (err) {
    console.log(err);

  }
    

}


exports.dashboardsearch=async(req,res)=>{
  try {
    res.render('dashboard/search',{
      searchresult:'',
      layout:'../views/layouts/dashboard'
    })
  } catch (err) {
    
  }
}

exports.dashboardsearchfind=async(req,res)=>{

  try {
    
    let searchterm=req.body.searchTerm;
    const searchspecialchar=searchterm.replace(/[^a-zA-Z0-9]/g,"");
    const searchresult=await Note.find({
      $or:[
        {title:{$regex:new RegExp(searchspecialchar,'i')}},
        {body:{$regex:new RegExp(searchspecialchar,'i')}}
      ]
    }).where({user:req.user.id})
    res.render('dashboard/search',{
      searchresult,
      layout:'../views/layouts/dashboard'
    })

    

  } catch (err) {
    console.log(err);
  }

}