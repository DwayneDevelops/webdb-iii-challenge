
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students').del()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {name: 'JOHN DOE', cohort_id: '1'},
        {name: 'JANE DOE', cohort_id: '2'},
        {name: 'JAMES DOE', cohort_id: '3'}
      ]);
    });
};
