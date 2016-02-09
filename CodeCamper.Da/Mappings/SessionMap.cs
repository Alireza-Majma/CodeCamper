using CodeCamper.Da;
using FluentNHibernate.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeCamper.Da
{
    public class SessionMap : ClassMap<Session>
    {
        public SessionMap()
        {
            Table("Session");
            Id(x => x.Id);
            Map(x => x.Title);
            Map(x => x.SpeakerId).Not.Insert().Not.Update();
            References(x => x.Speaker).Column("SpeakerId").ForeignKey("Person_SpeakerId").Class<Person>();
            Map(x => x.TrackId).Not.Insert().Not.Update();
            References(x => x.Track).Column("TrackId").ForeignKey("Track_TrackId").Class<Track>(); ;
            Map(x => x.TimeSlotId).Not.Insert().Not.Update();
            References(x => x.TimeSlot).Column("TimeSlotId").ForeignKey("TimeSlot_TimeSlotId").Class<TimeSlot>();
            Map(x => x.RoomId).Not.Insert().Not.Update();
            References(x => x.Room).Column("RoomId").ForeignKey("Room_RoomId").Class<Room>();
            Map(x => x.Level);
            Map(x => x.Tags);
            Map(x => x.Description);
            Map(x => x.Code);

            HasMany(x => x.AttendanceList)
            .KeyColumn("`SessionId`")
            .ForeignKeyConstraintName("`Session_SessionId`")
            .Table("`Attendance`")
            .ForeignKeyCascadeOnDelete()
            .AsSet()
            .Inverse();
        }

    }
}
