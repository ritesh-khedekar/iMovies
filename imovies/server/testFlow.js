const http = require('http');

const API_BASE = 'http://localhost:5000/api';

const makeRequest = (url, options = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    if (body) {
      const data = JSON.stringify(body);
      reqOptions.headers['Content-Type'] = 'application/json';
      reqOptions.headers['Content-Length'] = Buffer.byteLength(data);
    }

    const req = http.request(reqOptions, (res) => {
      let responseData = '';
      res.on('data', (chunk) => (responseData += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runAllTests = async () => {
  console.log('==============================================');
  console.log('   RUNNING IMOVIES END-TO-END TEST SUITE      ');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  const assert = (condition, testName, details = '') => {
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} ${details ? '- ' + details : ''}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const health = await makeRequest(`${API_BASE}/health`);
    assert(health.status === 200 && health.data.status === 'ok', '1. Server Health Check API');

    // 2. Register new test user
    const uniqueEmail = `testuser_${Date.now()}@test.com`;
    const regRes = await makeRequest(`${API_BASE}/auth/register`, { method: 'POST' }, {
      name: 'Test Customer',
      email: uniqueEmail,
      password: 'password123',
    });
    assert(
      regRes.status === 201 && regRes.data.token && !regRes.data.user.password,
      '2. User Registration (Token received, Password excluded)'
    );
    const userToken = regRes.data.token;

    // 3. User Login
    const loginRes = await makeRequest(`${API_BASE}/auth/login`, { method: 'POST' }, {
      email: uniqueEmail,
      password: 'password123',
    });
    assert(loginRes.status === 200 && loginRes.data.token, '3. User Login Verification');

    // 4. Admin Login with seeded admin credentials
    const adminLoginRes = await makeRequest(`${API_BASE}/auth/login`, { method: 'POST' }, {
      email: 'admin@imovies.com',
      password: 'admin123',
    });
    assert(
      adminLoginRes.status === 200 && adminLoginRes.data.user.role === 'admin',
      '4. Seeded Admin Login (role is admin)'
    );
    const adminToken = adminLoginRes.data.token;

    // 5. Auth /me endpoint
    const meRes = await makeRequest(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert(meRes.status === 200 && meRes.data.user.email === uniqueEmail, '5. GET /api/auth/me Profile verification');

    // 6. Browse movies
    const moviesRes = await makeRequest(`${API_BASE}/movies`);
    assert(moviesRes.status === 200 && moviesRes.data.data.length >= 10, '6. Browse Movies (Count >= 10)');
    const sampleMovie = moviesRes.data.data[0];

    // 7. Search and Filter movies
    const searchRes = await makeRequest(`${API_BASE}/movies?search=Inception`);
    assert(
      searchRes.status === 200 && searchRes.data.data.some((m) => m.title === 'Inception'),
      '7. Movie Search Filter (?search=Inception)'
    );

    const genreRes = await makeRequest(`${API_BASE}/movies?genre=Sci-Fi`);
    assert(
      genreRes.status === 200 && genreRes.data.data.every((m) => m.genre.includes('Sci-Fi')),
      '8. Movie Genre Filter (?genre=Sci-Fi)'
    );

    // 8. Get Shows for Movie
    const showsRes = await makeRequest(`${API_BASE}/shows/movie/${sampleMovie._id}`);
    assert(showsRes.status === 200 && showsRes.data.data.length > 0, '9. Fetch Shows for Movie');

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const targetShow = showsRes.data.data.find((s) => s.date >= todayStr) || showsRes.data.data[0];

    // Reset candidate test seats (G1, G2, H1, H2) on targetShow to guarantee clean slate for test runs
    const cleanBooked = (targetShow.bookedSeats || []).filter(
      (s) => !['G1', 'G2', 'H1', 'H2'].includes(s)
    );
    await makeRequest(
      `${API_BASE}/shows/${targetShow._id}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      { bookedSeats: cleanBooked }
    );

    // 9. Fetch fresh show details
    const showDetailRes = await makeRequest(`${API_BASE}/shows/${targetShow._id}`);
    assert(
      showDetailRes.status === 200 && !showDetailRes.data.data.bookedSeats.includes('G1'),
      '10. Fetch Show by ID (clean unbooked test seats)'
    );

    // 10. Book Seats
    const candidateSeats = ['G1', 'G2'];
    const bookRes = await makeRequest(
      `${API_BASE}/bookings`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
      },
      {
        showId: targetShow._id,
        seats: candidateSeats,
      }
    );

    const bookingData = bookRes.data.data || bookRes.data.booking;
    assert(
      bookRes.status === 201 &&
        bookingData?.seats?.length === 2 &&
        bookingData?.status === 'confirmed',
      '11. Book Seats (Confirmed booking with seats G1, G2)'
    );
    const bookingId = bookingData?._id;

    // 11. CRITICAL: Test Double-Booking Prevention
    const doubleBookRes = await makeRequest(
      `${API_BASE}/bookings`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
      },
      {
        showId: targetShow._id,
        seats: ['G1'], // Already booked!
      }
    );
    assert(
      doubleBookRes.status === 409 && !doubleBookRes.data.success,
      '12. Double-Booking Prevention (Status 409 Conflict when reserving already booked seat G1)'
    );

    // 12. Concurrency Race Condition Test: 2 simultaneous booking attempts for same seats
    const seatRace = ['H1', 'H2'];
    const [raceRes1, raceRes2] = await Promise.all([
      makeRequest(
        `${API_BASE}/bookings`,
        { method: 'POST', headers: { Authorization: `Bearer ${userToken}` } },
        { showId: targetShow._id, seats: seatRace }
      ),
      makeRequest(
        `${API_BASE}/bookings`,
        { method: 'POST', headers: { Authorization: `Bearer ${adminToken}` } },
        { showId: targetShow._id, seats: seatRace }
      ),
    ]);

    const oneSucceeded =
      (raceRes1.status === 201 && raceRes2.status === 409) ||
      (raceRes2.status === 201 && raceRes1.status === 409);
    assert(
      oneSucceeded,
      '13. Atomic Race-Condition Concurrency (Exactly one user succeeded, other user received 409 Conflict)'
    );

    // 13. View My Bookings
    const myBookingsRes = await makeRequest(`${API_BASE}/bookings/my`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const foundBooking = (myBookingsRes.data.data || []).find((b) => b._id === bookingId);
    assert(
      myBookingsRes.status === 200 &&
        foundBooking &&
        foundBooking.show &&
        foundBooking.show.movie,
      '14. View My Bookings (Populated with show and movie)'
    );

    // 14. Cancel Booking and release seats
    const cancelRes = await makeRequest(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    const cancelledData = cancelRes.data.data || cancelRes.data.booking;
    assert(
      cancelRes.status === 200 && cancelledData?.status === 'cancelled',
      '15. Cancel Booking (Status updated to cancelled and seats freed)'
    );

    // 15. Verify released seats can now be booked again!
    const reBookRes = await makeRequest(
      `${API_BASE}/bookings`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${userToken}` },
      },
      {
        showId: targetShow._id,
        seats: ['G1'],
      }
    );
    assert(
      reBookRes.status === 201,
      '16. Released Seats Available (Seat G1 re-booked successfully after cancellation)'
    );

    console.log('\n==============================================');
    console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('==============================================\n');

    process.exit(failed === 0 ? 0 : 1);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
};

runAllTests();
