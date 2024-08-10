const Header = ({ course }) => <h2>{course}</h2>

const Part = ({ part }) => <div>{part.name} {part.exercises}</div>

const Total = ({ parts }) => (
  <div>
    <strong>
      Total of {parts.map(part => part.exercises).reduce((accu, curr) => accu + curr, 0)} courses
    </strong>
  </div>
)

const Course = ({ course }) => {
  const { name, parts } = course

  return (
    <div>
      <Header course={name} />
      {parts.map(part => 
        <Part key={part.id} part={part} />
      )}
      <Total parts={parts} />
    </div>
  )
}

const Content = ({ courses }) => {
  return (
    <div>
      <h1>Web development curriculum</h1>
      {courses.map(course =>
        <Course key={course.id} course={course} />
      )}
    </div>
  )
}

export default Content