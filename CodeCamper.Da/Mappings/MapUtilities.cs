using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace CodeCamper.Da.Mappings
{
    public static class MapUtilities
    {
        public static List<KeyValuePair<string, List<String>>> GetCustomAttributes()
        {
            var rslt = new List<KeyValuePair<string, List<String>>>();
            
            Assembly assembly = typeof(Person).Assembly;
            foreach (Type type in assembly.GetTypes())
            {
                if (type.Name.EndsWith("Map") && type.BaseType != null && type.BaseType.IsGenericType)
                {
                    var tInfo = type.BaseType.GenericTypeArguments[0];
                    foreach (var pInfo in tInfo.GetProperties())
                    {
                        var attrs = pInfo.CustomAttributes;
                        var attrList = new List<String>();
                        foreach (CustomAttributeData a in attrs)
                        {
                            var attrFun = a.AttributeType.Name + "(";
                            var argValues = new List<string>();
                            foreach (var arg in a.ConstructorArguments)
                            {
                                argValues.Add(arg.Value.ToString());
                            }
                            foreach (var arg in a.NamedArguments)
                            {
                                argValues.Add(arg.TypedValue.Value.ToString());
                            }
                            String.Join(",", argValues);
                            attrList.Add(a.AttributeType.Name + "(" + String.Join(",", argValues) + ")");

                        }
                        if (attrList.Count > 0)
                        {
                            rslt.Add(new KeyValuePair<string, List<string>>(string.Format("{0},{1}", tInfo.Name, ConvertToCamelCase(pInfo.Name)), attrList));
                        }
                    }
                }
                Console.WriteLine(type.FullName);
            }
            return rslt;
        }

        public static string ConvertToCamelCase(string s)
        {
            if (string.IsNullOrEmpty(s))
                return s;
            if (!char.IsUpper(s[0]))
                return s;
            char[] chars = s.ToCharArray();
            for (int i = 0; i < chars.Length; i++)
            {
                bool hasNext = (i + 1 < chars.Length);
                if (i > 0 && hasNext && !char.IsUpper(chars[i + 1]))
                    break;
                chars[i] = char.ToLower(chars[i], CultureInfo.InvariantCulture);
            }
            return new string(chars);
        }
    }
}
