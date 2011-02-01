import java.applet.Applet;

import netscape.javascript.JSException;
import netscape.javascript.JSObject;


public class AppletTest extends Applet {

	public JSObject js;
	
	@Override
	public void init() {
		System.out.println("Applet created sending 'Init' event 4");
		js = getJS();
		String id = getParameter("id");
		js.eval("publish(\"Init:" + id + "\")");
	}
	
	public boolean get_member;
	public boolean get_nested_member;
	public boolean get_nested_object_member;

	public boolean call_with_primitive_return_value;
	public boolean call_with_object_return_value;
	
	public boolean eval_call_return_value;
	
	// test Java-2-JS intercation
	public void test(){
		log("test_get_member");
		test_get_member();
		
		log("test_get_nested_object_member");
		test_get_nested_object_member();
		
		log("test_set_member");
		test_set_member();
		
		log("test_call_with_null");
		test_call_null_arg();
		
		log("test_call_with_no_arg");
		test_call_empty_arg();
		
		log("test_call_primitive_arg");
		test_call_primitive_arg();
		
		log("test_call_object_arg");
		test_call_object_arg();
		
		log("test_call_with_primitive_return_value");
		test_call_with_primitive_return_value();
		
		log("test_call_with_object_return_value");
		test_call_with_object_return_value();
		
		log("test_eval_call_with_arg");
		test_eval_call_with_arg();
		
		log("test_eval_call_with_return_value");
		test_eval_call_with_return_value();
	}
	

	private void test_get_member(){
		get_member = (Boolean)js.getMember("member");
	}

	private void test_get_nested_object_member() {
		JSObject o = (JSObject)((JSObject)js.getMember("nested_member")).getMember("obj");
		get_nested_object_member = (Boolean)o.call("test", null);
	}

	private void test_set_member(){
		js.setMember("member_for_set_member", true);		
	}
	
	private void test_call_null_arg(){
		js.call("call_null_arg", null);
	}
	
	private void test_call_empty_arg(){
		js.call("call_empty_arg", new Object[]{});
	}
	
	private void test_call_primitive_arg(){
		js.call("call_primitive_arg", new Object[]{true});
	}
	
	private void test_call_object_arg(){
		Test t = new Test();
		js.call("call_object_arg", new Object[]{t});
	}
	
	private void test_call_with_primitive_return_value(){
		call_with_primitive_return_value = (Boolean)js.call("call_with_primitive_return_value", null);
	}
	
	private void test_call_with_object_return_value(){
		try{
			call_with_object_return_value = (Boolean)((JSObject)js.call("call_with_object_return_value", null)).getMember("test");
		}
		catch(JSException e){
			e.printStackTrace();
		}
	}
	
	private void test_eval_call_with_arg(){
		js.eval("eval_call_with_arg(true);");
	}
	
	private void test_eval_call_with_return_value(){
		Object o = js.eval("eval_call_return_value();");
		eval_call_return_value = (Boolean)o;
	}
	
	private JSObject getJS() {
		js = JSObject.getWindow(this);
		if(js == null){
			throw new RuntimeException("JSObject is null");
		}
		return js;
	}
	
	public boolean callToJava(){
		return true;
	}
	
	public Object getMember(String member){
		return (JSObject)js.getMember(member);
	}
	
	public Object getNestedMember(String parent, String member){
		return ((JSObject)js.getMember(parent)).getMember(member);
	}
	
	public void setMember(String member, Object value){
		System.out.println("member" + member + "value" + value);
		js.setMember(member, value);
	}
	
	public void setNestedMember(String parent, String member, Object value){
		((JSObject)js.getMember(parent)).setMember(member, value);
	}
	
	public Object eval(String s){
		log("eval('" + s + "')");
		Object o = js.eval(s);
		log("return value", o);
		return o;
	}
	
	public Object call(String fct, Object ... args){
		log("call('" + fct + "'," + args + ")");
		Object o = js.call(fct, args);
		log("return value", o);
		return o;
	}
	
	public int getInt(){
		return 1;
	}
	
	public int setInt(int i){
		return i;
	}
	
	public double setDouble(double d){
		return d;
	}
	
	public Object getObject(){
		return new Object[]{"true", 1};
	}
	
	public String getString(){
		return "true";
	}
	
	public static void log(Object ... args){
		StringBuilder sb = new StringBuilder();
		for(Object s : args){
			sb.append(s);
			sb.append(",");
		}
		System.out.println(sb.toString());
	}
	
	public class Test{
		public String _string = "true";
		public boolean _boolean = true;
		public int _int = 1;
		
		public Test(){}
		
		public String test(){
			return "true";
		}
	}
	
}
