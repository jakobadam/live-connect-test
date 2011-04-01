applet_dir = typeof applet_dir != 'undefined' ? applet_dir : '/';
applet_path = applet_dir + 'applet.jar';

String.prototype.substitute = function(/*Object*/map){
	return this.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
		function(match, key, format){
			var value = map[key];
			return value ? value.toString() : "${" + key + "}";
		}); // String
};

_events = {};

function subscribe(/*String*/event_name, /*function*/fct){
  var subs = _events[event_name] || [];
  subs.push({'fct':fct});
  _events[event_name] = subs;
}

function publish(/*String*/event_name){
  // some safari bug creates a deadlock if we continue to call.
  // Detach here
  setTimeout(
    function(){
      var subs = _events[event_name] || [];
      var len = subs.length;
      for(var i = 0; i < len; i++){
        subs[i].fct();
      }    
    }, 0);
}

var applet_specs = {
  with_object_tag: {
    id: "1",
    name: "Object tag",
    html: [
'<object id="1" type="application/x-java-applet" width="1" height="1" >',
'  <param name="code" value="AppletTest" />',
'  <param name="archive" value="' + applet_path + '?v=',new Date().getTime(),'" />',
'  <param name="id" value="1" />',
'</object>'].join('\n')
  },
  with_applet_tag: {
    id: "2",
    name: "Applet tag",
    html:[
'<applet id="2" archive="' + applet_path + '?v=' +  new Date().getTime() + '" code="AppletTest" width="1" height="1">',
'  <param name="id" value="2" />',
'</applet>'].join('\n')
  },
  with_object_tag_and_mayscript: {
    id: "3",
    name: "Object tag with mayscript attribute",
    html: [
'<object id="3" type="application/x-java-applet" width="1" height="1">',
'  <param name="code" value="AppletTest" />',
'  <param name="archive" value="' + applet_path + '?v=' + new Date().getTime() + '" />',
'  <param name="mayscript" value="true" />',
'  <param name="id" value="3" />',
'</object>'].join('\n')
  },
  with_applet_tag_and_mayscript: {
    id: "4",
    name: "Applet tag with mayscript attribute",
    html: [
'<applet id="4" archive="' + applet_path + '?v=' + new Date().getTime() + '" code="AppletTest" mayscript="true" width="1" height="1">',
'  <param name="id" value="4" />',
'</applet>'].join('\n')
  },
  with_object_tag_and_mayscript_and_nojar: {
    id: "5",
    name: "Object tag with mayscript attribute and no jar",
    html: [
'<object id="5" type="application/x-java-applet" width="1" height="1">',
'  <param name="mayscript" value="true" />',
'  <param name="codebase" value="' + applet_dir + 'bin/" />',
'  <param name="code" value="AppletTest" />',
'  <param name="id" value="5" />',
'</object>'].join('\n')
  }// ,
//   with_deploy_js: {
//     id: "6",
//     name: "Applet tag with deploy.js",
//     html: [
// '<script>',
// '  var attributes = {width:300, height:300, id:"6", code:"AppletTest", archive: "/applet.jar"};',
// '  var parameters = {id: "6"};', 
// '  deployJava.runApplet(attributes, parameters, "1.6");',
// '</script>'].join('\n')
//   }
};

$.each(applet_specs, function(i, o){
  o.escaped = o.html.replace(/</g, "&lt;").replace(/>/g,"&gt;");
});


var member,
    member_for_set_member,
    nested_member,
    called_empty_arg,
    called_null_arg,
    called_primitive_arg,
    called_object_arg,
    eval_called_with_arg;

// called from Java
function call_empty_arg(){
  called_empty_arg = true;
}

function call_null_arg(){
  called_null_arg = true;
}

function call_primitive_arg(a){
  called_primitive_arg = (a == true);
}

function call_object_arg(a){
  try{
     if(a._string !== "true" || a._int !== 1 || a._boolean !== true || a.test() != "true"){
       lg('was', a.test(), 'expected', 'true');
       lg('was', a._int, 'expected', 1);
       lg('was', a._string, 'expected', 'true');
       lg('was', a._boolean, 'expected', true);
     }
    else{
      called_object_arg = true;
    } 
  } catch (x) {
        called_object_arg = false;
  }
}
function call_with_primitive_return_value(){
  return true;
}
function call_with_object_return_value(){
  return {test:true};
}
function eval_call_with_arg(a){
  eval_called_with_arg = a;
}
function eval_call_return_value(){
  return true;
}

function reset_test(){
    member = true,
    member_for_set_member = false,     
    nested_member = {
      test: true,
      obj: {
        test: function(){
          return true;
        }
      }
    },
    called_null_arg = false,
    called_empty_arg = false,
    called_primitive_arg = false,
    called_object_arg = false,
    eval_called_with_arg = false;
}

function test_applet(/* Applet */ a){
  reset_test();
  a.test();  

  var results = [
    {
      name: "(J) JSObject != null",
      result: a.js != null
    },{
      name: "(J) <code>getMember</code>",
      result: a.get_member
    },{
      name: "(J) <code>setMember</code>",
      result: member_for_set_member
    },{
      name: "(J) <code>getMember</code> nested object call fct on it",
      result: a.get_nested_object_member
    },{
      name: "(J) <code>call</code> null args.",
      result: called_null_arg
    },{
      name: "(J) <code>call</code> empty args.",
      result: called_empty_arg
    },{
      name: "(J) <code>call</code> prim. arg",
      result: called_primitive_arg
    },{
      name: "(J) <code>call</code> java object arg",
      result: called_object_arg
    },{
      name: "(J) <code>call</code> with prim. return value",
      result: a.call_with_primitive_return_value
    },{
      name: "(J) <code>call</code> with obj. return value",
      result: a.call_with_object_return_value
    },{
      name: "(J) call with <code>eval</code>",
      result: eval_called_with_arg
   },{
      name: "(J) call with <code>eval</code> return value",
      result: a.eval_call_return_value
   },
    {
      name: "(JS) get prim. java member",
      result: a.getInt() === 1
    },
    {
      name: '(JS) Java Strings are converted to JavaScript strings',
      result: a.getString() === "true"
    },{
      name: "(JS) get object java member",
      result: (a.getObject()[0] === "true" && a.getObject()[1] === 1)
    }
  ];
  return results;    
}

function byId(id){return document.getElementById(id);}

function test(/* applet_spec */ a, /* String */ jar_path){
  var t = '<li class="${result}">${name}</li>';
  $('#applets').append(a.html);    
  
  subscribe("Init:" + a.id, function(){
    var results = test_applet(byId(a.id));
    var results_htmlified = [];
              
    $.each(results, function(i,v){
      results_htmlified.push(t.substitute({result:v.result ? "true" : "false", name: v.name}));
    });
    
    var elm = $('<h3>' + a.name + '</h3>' +
'<pre>' + a.escaped + '</pre>' +
'<ul class="test">' + results_htmlified.join("") + '</ul>').hide();
    $('#results').prepend(elm);
    elm.slideDown();
  });
}



