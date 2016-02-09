
using CodeCamper.Da;
using FluentNHibernate.Mapping;

namespace CodeCamper.Da
{
    public class PersonMap : ClassMap<Person>
    {
        public PersonMap()
        {
            Table("Person");
            Id(x => x.Id);
            Map(x => x.FirstName).Length(30).Not.Nullable();
            Map(x => x.LastName).Length(30).Not.Nullable(); ;
            Map(x => x.Email);
            Map(x => x.Blog);
            Map(x => x.Twitter);
            Map(x => x.Gender);
            Map(x => x.ImageSource);
            Map(x => x.Bio);
            HasMany(x => x.SpeakerSessions)
                .KeyColumn("`SpeakerId`")
                .ForeignKeyConstraintName("`Person_SpeakerId`")
                .Table("`Session`")
                .ForeignKeyCascadeOnDelete()
                .AsSet()
                .Inverse();
            HasMany(x => x.AttendanceList)
                .KeyColumn("`PersonId`")
                .ForeignKeyConstraintName("`Person_PersonId`")
                .Table("`Attendance`")
                .ForeignKeyCascadeOnDelete()
                .AsSet()
                .Inverse();
            /*
            <set name="SpeakerSessions" table="`Session`" cascade="all-delete-orphan" inverse="true">
            <key column="SpeakerId" foreign-key="Person_SpeakerId" />
            <one-to-many class="Session" />
            </set>
            */
        }

    }
}

