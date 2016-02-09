using System.Collections.Generic;
using Iesi.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace CodeCamper.Da
{
    [T4TS.TypeScriptInterface]
    public class Person
    {
        public Person()
        {
            Gender = " "; // make no assumption
            ImageSource = string.Empty;
            SpeakerSessions = new HashedSet<Session>();
            AttendanceList = new HashedSet<Attendance>();
        }
        public virtual int Id { get; set; }

        [Required, Display(Name ="First Name"), MinLength(6)]
        public virtual string FirstName { get; set; }
        [Required,MinLength(6)]
        public virtual string LastName { get; set; }
        [EmailAddress,Required,DataType(DataType.EmailAddress)]
        public virtual string Email { get; set; }
        [Url, DataType(DataType.Url)]
        public virtual string Blog { get; set; }
        public virtual string Twitter { get; set; }

        [StringLength(1,MinimumLength = 1) ]
        public virtual string Gender { get; set; }
        [DataType(DataType.ImageUrl)]
        public virtual string ImageSource { get; set; }
        [DataType(DataType.MultilineText)]
        public virtual string Bio { get; set; }

        public virtual ICollection<Session> SpeakerSessions { get; set; }
       
        public virtual ICollection<Attendance> AttendanceList { get; set; }

        public virtual string FullName { get { return string.Format("{0} {1}", FirstName, LastName); } }

    }
}
