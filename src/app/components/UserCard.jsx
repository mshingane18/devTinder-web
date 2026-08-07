const UserCard = ({ user }) => {
  const { firstName, lastName, age, gender, about, photoUrl, skills } = user;

  return (
    <div className="flex justify-center mt-5">
      <div className="card bg-base-300 w-80 shadow-lg p-1">
        <figure className="h-86 overflow-hidden">
          <img
            src={photoUrl}
            alt={firstName}
            className="w-full h-full object-cover object-center"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">{firstName + " " + lastName}</h2>
          <p>
            {age && <span>{age}</span>}
            {gender && <span>, {gender}</span>}
          </p>
          <p>{about}</p>
          <p>{skills}</p>
          <div className="card-actions justify-center mt-2">
            <button className="btn btn-primary">Ingored</button>
            <button className="btn btn-secondary">Interested</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserCard;
