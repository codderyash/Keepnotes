/*
GET
homepage
*/ 

 
exports.homepage = async (req, res) => {

    const locals = {
        title: 'KeepNotes',
        description: 'very useful notes'
    }

    res.render('index.ejs', {
        locals,
        layout:'../views/layouts/front_page'
    });
}

/*
GET
  about
*/ 


exports.about = async (req, res) => {

    const locals = {
        title: 'about nodejs',
        description: 'very useful notes'
    }

    res.render('about.ejs', locals);
}
