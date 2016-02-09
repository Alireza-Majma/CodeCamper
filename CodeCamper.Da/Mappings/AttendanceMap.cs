using CodeCamper.Da;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeCamper.Da
{
    public class AttendanceMap : ClassMap<Attendance>
    {
        public AttendanceMap()
        {
            Table("Attendance");
            CompositeId().KeyProperty(x => x.SessionId).KeyProperty(x => x.PersonId);

            References(x => x.Session).Column("SessionId").ForeignKey("Session_SessionId");
            Map(x => x.SessionId).Not.Insert().Not.Update();

            References(x => x.Person).Column("PersonId").ForeignKey("Person_PersonId");
            Map(x => x.PersonId).Not.Insert().Not.Update();
            Map(x => x.Rating);
            Map(x => x.Text);
        }

    }
}
